var mysql = require('mysql');
var connectDb = require("./db-connect.js");

exports.sign = function(req, res) {
	var refDb = connectDb.getConnection();
	var today = new Date();
	var users = {
		"firstname":req.body.firstname,
		"lastname":req.body.lastname,
		"email":req.body.email,
		"pass":req.body.pass,
		"created": today,
		"method": "app",
		"token": null,
		"facebook_access_token": null,
		"google_access_token": null,
		"googlenotification_trigger" : false,
		"slack_reacttrigger": false,
		"slack_uploadtrigger": false,
		"slack_msgtrigger": false,
		"oncejob_trigger": false,
		"repetitivejob_trigger": false
	}

	refDb.query('SELECT * FROM users WHERE email = ?',[users.email], function (error, results, fields) {
		if (error) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT): ", error);
			res.send({
				"code": 400,
				"failed": "[MySQL] Error ocurred (SELECT)"
			});
		} else {
			if (users.pass == "") {
				console.log('\x1b[31m', "[MySQL] Empty password: ", error);
				res.send({
					"code": 400,
					"failed": "[MySQL] Empty password"
				});
			} else {
				insertData(res, results, refDb, users);
			}
		}
	});
}

function insertData(res, results, refDb, users) {
	if (results.length == 0) {
		refDb.query('INSERT INTO users SET ?', users, function(error, results, fields) {
			if (error) {
				console.log('\x1b[31m', "[MySQL] Error ocurred (INSERT): ", error);
				res.send({
					"code": 400,
					"failed": "[MySQL] Error ocurred (INSERT)"
				});
			} else {
				console.log(results)
				console.log('\x1b[32m', 'Signin successfully');
				res.send({
					"code": 200,
					"success": "Signin successfully",
					"firstname":users.firstname,
					"lastname":users.lastname,
					"email":users.email,
					"pass":users.pass,
					"created": users.created,
					"method": users.method,
					"token": null,
					"facebook_token": null,
					"google_token": null,
					"googlenotification_trigger" : false,
					"slack_reacttrigger": false,
					"slack_uploadtrigger": false,
					"slack_msgtrigger": false,
					"repetitivejob_trigger": false,
					"oncejob_trigger": false
				});
			}
		});
	} else {
		console.log('\x1b[31m', 'Email already exist');
		res.send({
			"code": 400,
			"failed": "Email already exist"
		});
	}
}
