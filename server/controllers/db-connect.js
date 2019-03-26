var mysql = require('mysql');
var connection;

exports.dbConnect = function() {
	connection = mysql.createConnection({
		host     : 'db',
		user     : 'root',
		password : 'samthol',
		database : 'area'
	});

	connection.connect(function(err){
		if(!err) {
			console.log("Database is connected ... nn");
			return 0;
		} else {
			console.log("Error connecting database ... nn");
			console.log(err);
			return -1;
		}
	});
}

exports.getConnection = function() {
	return connection;
}
