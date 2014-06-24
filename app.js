var mysql    = require ('mysql')
  , settings = require ('./settings')
  , q        = require ('q');

var connection = mysql.createConnection(settings.db);

connection.connect();


return query("SHOW TABLES", [], connection)
.then(function (tables) {

  // put table names in array
  tables = tables.map(function (table) {
    return table['Tables_in_' + settings.db.database];
  });

  tables.forEach(function (table) {
    fillTable(table);
  });

});


// promisfied mysql.query function
function query (sql, parameters, connection) {
  var defer = q.defer();

  connection.query(sql, parameters, function (err, result) {
    if (err) {
      console.log('mysql query error: ', err);
      return defer.reject(err)
    }
    defer.resolve(result);
  });

  return defer.promise;
}

function fillTable (table) {
  return getColumns(table)
  .then(function (columns) {

    console.log(columns);

  });
}

function getColumns (table) {
  var sql = "SHOW COLUMNS FROM " + table;

  return query(sql, [], connection)
  .then(function (columns) {

    return q(columns);

  });
}
