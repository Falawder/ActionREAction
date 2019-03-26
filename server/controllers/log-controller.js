var mysql = require('mysql');
var connectDb = require("./db-connect.js");
const uuidv4 = require('uuid/v4');

exports.log = function(req, res) {
	var refDb = connectDb.getConnection();
	var email = req.body.email;
	var password = req.body.pass;

	refDb.query('SELECT * FROM users WHERE email = ?', [email] , function (error, results, fields) {
		if (error) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
			res.send({
				"code": 400,
				"failed": "[MySQL] Error ocurred (SELECT)"
			})
		} else {
			if(results.length > 0) {
				if(results[0].pass == password) {
					setTokenAndRespond(res, refDb, email);
				} else {
					console.log('\x1b[31m', "Email and password does not match:", error);
					res.send({
						"code": 204,
						"failed": "Email and password does not match"
					});
				}
			}
			else {
				console.log('\x1b[31m', "Email does not exits:", error);
				res.send({
					"code": 204,
					"failed": "Email does not exits"
				});
			}
		}
	});
}

function setTokenAndRespond(res, refDb, email) {
	var genTok = uuidv4();

	refDb.query('UPDATE users SET token = ? WHERE email = ?', [genTok, email] , function (tmperror, tmpres, tmpfields) {
		if (tmperror) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (UPDATE):", tmperror);
			res.send({
				"code": 204,
				"failed": "[MySQL] Error ocurred (UPDATE)"
			});
		}
		else {
			respond(refDb, email, res, genTok);
		}
	});
}

function respond(refDb, email, res, genTok) {
	refDb.query('SELECT * FROM users WHERE email = ?', [email] , function (error, results, fields) {
		if (error) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
			res.send({
				"code": 204,
				"failed": "[MySQL] Error ocurred (SELECT)"
			});
		} else {
			console.log('\x1b[32m', "Login sucessfull, token generated sucessfully");
			res.send({
				"code": 200,
				"success": "Login sucessfull, token generated sucessfully",
				"firstname":results[0].firstname,
				"lastname":results[0].lastname,
				"email":results[0].email,
				"pass":results[0].pass,
				"created": results[0].created,
				"method": results[0].method,
				"token": genTok,
				"facebook_token": results[0].facebook_access_token,
				"google_token": results[0].google_access_token,
				"google_trigger": results[0].googlenotification_trigger,
				"slack_reacttrigger": results[0].slack_reacttrigger,
				"slack_uploadtrigger": results[0].slack_uploadtrigger,
				"slack_msgtrigger": results[0].slack_msgtrigger,
				"repetitivejob_trigger": results[0].repetitivejob_trigger,
				"oncejob_trigger": results[0].oncejob_trigger_trigger

			});
		}
	});
}
