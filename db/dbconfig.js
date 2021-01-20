var mysql = require('mysql');

var connection = mysql.createConnection({
	host: process.env.MYSQL_HOSTNAME,
	user: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
});

module.exports = connection;
