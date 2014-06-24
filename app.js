var mysql    = require ('mysql')
  , settings = require ('./settings')
  , q        = require ('q')
  , fs       = require ('fs');

var connection = mysql.createConnection(settings.db);

connection.connect();

// load dictionaries
console.log("Loading dictionaries...");

var fNames = fs.readFileSync('./dicts/first_names.txt', {encoding: 'utf-8'}).split('\n')
  , lNames = fs.readFileSync('./dicts/last_names.txt',  {encoding: 'utf-8'}).split('\n')
  , words  = fs.readFileSync('./dicts/words.txt',       {encoding: 'utf-8'}).split('\n');

console.log("Finished loading dictionaries.");


// get tables
return query("SHOW TABLES", [], connection)
.then(function (tables) {

  // put table names in array
  tables = tables.map(function (table) {
    return table['Tables_in_' + settings.db.database];
  });

  // fill the tables
  tables.forEach(function (table) {

    return getColumns(table)
    .then(function (columns) {

      fill(table, columns);

    });
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

function getColumns (table) {
  var sql = "SHOW COLUMNS FROM " + table;

  return query(sql, [], connection)
  .then(function (columns) {

    return q(columns);

  });
}

function fill (table, columns) {



}
