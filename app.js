var mysql      = require ('mysql')
  , settings   = require ('./settings');

var connection = mysql.createConnection(settings.db);

connection.connect();

var query = function (sql, parameters, connection) {
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

