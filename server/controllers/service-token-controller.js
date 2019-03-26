var mysql = require('mysql');
var connectDb = require("./db-connect.js");
const uuidv4 = require('uuid/v4');

exports.addToken = function(req, res, service) {
	var refDb = connectDb.getConnection();
	var userToken = req.body.token;
	var serviceToken = req.body.userToken;
	var serviceUserId = req.body.userId;
	var googleMail = req.body.googleMail;

	refDb.query('SELECT * FROM users WHERE token = ?', [userToken] , function (error, results, fields) {
		if (error) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
			res.send({
				"code": 400,
				"failed": "[MySQL] Error ocurred (SELECT)"
			})
		} else if (results.length > 0) {
			updateTokenAndRespond(refDb, res, serviceToken, serviceUserId, userToken, service, googleMail);
		} else {
			console.log('\x1b[31m', "Account does not exits:", error);
			res.send({
				"code": 204,
				"failed": "Account does not exits"
			});
		}
	});
}

function updateTokenAndRespond(refDb, res, serviceToken, serviceUserId, userToken, service, googleMail) {
	var sqlUpdateRequest;

	if (service == "google")
		sqlUpdateRequest = 'UPDATE users SET '.concat(service.concat("_access_token"), ' = \'', serviceToken, '\', ', service, '_user_id = \'', serviceUserId, '\', google_user_mail = \'', googleMail ,'\' WHERE token = \'', userToken, '\'');
	else
		sqlUpdateRequest = 'UPDATE users SET '.concat(service.concat("_access_token"), ' = \'', serviceToken, '\', ', service, '_user_id = \'', serviceUserId, '\' WHERE token = \'', userToken, '\'');
	refDb.query(sqlUpdateRequest , function (tmperror, tmpres, tmpfields) {
		if (tmperror) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (SET):", tmperror);
			res.send({
				"code": 204,
				"failed": "Error while generating token"
			});
		}
		else {
			console.log('\x1b[32m', "Token added sucessfully");
			res.send({
				"code": 200,
				"success": "Token added sucessfully"
			});
		}
	});
}