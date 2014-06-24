var mysql    = require ('mysql')
  , settings = require ('./settings')
  , q        = require ('q')
  , fs       = require ('fs')
  , _        = require ('underscore');

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

  // get associations
  var associations = getAssociations(tables);

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

  console.log('Executing query: ', sql);

  connection.query(sql, parameters, function (err, result) {
    if (err) {
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

function getAssociations (tables) {
  var sql = 'USE INFORMATION_SCHEMA; '
          + 'SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME '
          + 'FROM KEY_COLUMN_USAGE '
          + 'WHERE REFERENCED_TABLE_NAME IN ("' + tables.join('", "') + '");';

  return query(sql, [], connection)
  .then(function (associations) {

    associations = associations[1].map(function (association) {
      if (!!association.REFERENCED_TABLE_NAME && !!association.REFERENCED_COLUMN_NAME)
        return association;
    });

    // remove null entries from not returning a value with .map
    associations = _.compact(associations);

    console.log(associations);

  });
}

function fill (table, columns) {

  // console.log(table);
  // console.log(columns);

}
