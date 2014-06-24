var mysql      = require ('mysql')
  , settings   = require ('./settings');

var connection = mysql.createConnection(settings.db);

connection.connect();



