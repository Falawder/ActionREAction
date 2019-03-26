var mysql = require('mysql');
var connectDb = require("./db-connect.js");
const uuidv4 = require('uuid/v4');
const dataGet = require("./data-get.js");


exports.logNetwork = function(req, res, network) {
	var refDb = connectDb.getConnection();
	var today = new Date();
	var servicesArray = dataGet.getServices();
	var users = {
		"firstname":req.body.firstname,
		"lastname":req.body.lastname,
		"email":req.body.email,
		"created": today,
		"token": req.body.token,
		"user_id": req.body.user_id,
		"googlenotification_trigger" : false,
		"slack_reacttrigger": false,
		"slack_uploadtrigger": false,
		"slack_msgtrigger": false
	}

	refDb.query('SELECT * FROM users WHERE email = ?', [users.email], function (error, results, fields) {
		if (error) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT): ", error);
			res.send({
				"code": 400,
				"failed": "[MySQL] Error ocurred (SELECT)"
			});
		} else {
			if (results.length == 0 && servicesArray.indexOf(network) > -1) {
				signByNetworkMethod(res, results, refDb, users, network);
			} else if (results.length != 0 && servicesArray.indexOf(network) > -1) {
				logByNetworkMethod(res, results, refDb, users, network);
			} else {
				console.log('\x1b[31m', 'Invalid url parameters');
				res.send({
					"code": 204,
					"failed": "Invalid url parameters"
				});
			}
		}
	});
}

function signByNetworkMethod(res, results, refDb, users, network) {
	var sqlRequest;

	sqlRequest = 'INSERT INTO users SET firstname = \''.concat(users.firstname, '\', lastname = \'', users.lastname, '\', email = \'', users.email, '\', created = NOW(), method = \'', network, '\', ', network, '_access_token = \'', users.token, '\', ', network, '_user_id = \'', users.user_id, '\'',', slack_reacttrigger = false , slack_uploadtrigger = false, slack_msgtrigger = false , googlenotification_trigger = false , repetitivejob_trigger = false , oncejob_trigger= false');
	refDb.query(sqlRequest, function(error, results, fields) {
		if (error) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (INSERT): ", error);
			res.send({
				"code": 400,
				"failed": "[MySQL] Error ocurred (INSERT)"
			});
		} else {
			signSetTokenAndRespond(res, refDb, users);
		}
	});
}

function signSetTokenAndRespond(res, refDb, users) {
	var genTok = uuidv4();

	refDb.query('UPDATE users SET token = ? WHERE email = ?', [genTok, users.email] , function (tmperror, tmpres, tmpfields) {
		if (tmperror) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (UPDATE): ", tmperror);
			res.send({
				"code": 204,
				"failed": "[MySQL] Error ocurred (UPDATE)"
			});
		}
		else {
			signRespond(res, users, refDb, genTok);
		}
	});

}

function signRespond(res, users, refDb, genTok) {
	refDb.query('SELECT * FROM users WHERE email = ?', [users.email] , function (error, results, fields) {
		if (error) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT): ", error);
			res.send({
				"code": 400,
				"failed": "[MySQL] Error ocurred (SELECT)"
			});
		} else if (results && results[0]){
			console.log('\x1b[32m', "Signin sucessfull, token generated sucessfully (by network)");
			res.send({
				"code": 200,
				"success": "Signin successfully (by network)",
				"firstname":results[0].firstname,
				"lastname":results[0].lastname,
				"email":results[0].email,
				"pass":results[0].pass,
				"created": results[0].created,
				"method": results[0].method,
				"token": genTok,
				"facebook_token": results[0].facebook_access_token,
				"facebook_user_id": results[0].facebook_user_id,
				"google_token": results[0].google_access_token,
				"google_user_id": results[0].google_user_id,
				"slack_reacttrigger": results[0].slack_reacttrigger,
				"slack_uploadtrigger": results[0].slack_uploadtrigger,
				"slack_msgtrigger": results[0].slack_msgtrigger,
				"repetitivejob_trigger": results[0].repetitivejob_trigger,
				"oncejob_trigger": results[0].oncejob_trigger_trigger
			});
		}
	});
}

function logByNetworkMethod(res, results, refDb, users, network) {
	if(results[0].pass) {
		console.log('\x1b[31m', "Email already attached to an account area");
		res.send({
			"code": 204,
			"failed": "Email already attached to an account area"
		});
	} else {
		logSetTokenAndRespond(res, refDb, users, network);
	}
}

function logSetTokenAndRespond(res, refDb, users, network) {
	var sqlRequest;

	sqlRequest = 'UPDATE users SET '.concat(network, '_access_token = \'', users.token, '\', ', network, '_user_id = \'', users.user_id, '\' WHERE email = \'', users.email, '\'');
		refDb.query(sqlRequest, function(error, results, fields) {
		if (error) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (UPDATE): ", error);
			res.send({
				"code": 400,
				"failed": "[MySQL] Error ocurred (UPDATE)"
			});
		} else {
			console.log('\x1b[32m', 'User loged sucessfully (by network)');
			var genTok = uuidv4();
			refDb.query('UPDATE users SET token = ? WHERE email = ?', [genTok, users.email] , function (tmperror, tmpres, tmpfields) {
				if (tmperror) {
					console.log('\x1b[31m', "[MySQL] Error ocurred (SET): ", tmperror);
					res.send({
						"code": 204,
						"failed": "Error while generating token"
					});
				}
				else {
					logRespond(res, users, refDb, genTok);
				}
			});
		}
	});
}

function logRespond(res, users, refDb, genTok) {
	refDb.query('SELECT * FROM users WHERE email = ?', [users.email] , function (error, results, fields) {
		console.log('\x1b[32m', "Login sucessfull, token generated sucessfully (by network)");
		res.send({
			"code": 200,
			"success": "Login sucessfull, token generated sucessfully (by network)",
			"firstname":results[0].firstname,
			"lastname":results[0].lastname,
			"email":results[0].email,
			"pass":results[0].pass,
			"created": results[0].created,
			"method": results[0].method,
			"token": genTok,
			"facebook_token": results[0].facebook_access_token,
			"facebook_user_id": results[0].facebook_user_id,
			"google_token": results[0].google_token,
			"google_user_id": results[0].google_user_id,
			"googlenotification_trigger" : false,
			"slack_reacttrigger": false,
			"slack_uploadtrigger": false,
			"slack_msgtrigger": false,
			"repetitivejob_trigger": false,
			"oncejob_trigger": false
		});
	});
}
