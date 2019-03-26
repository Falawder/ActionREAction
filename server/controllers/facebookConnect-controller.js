var connectDb = require("./db-connect.js");
var axios = require("axios");
var FormData = require("form-urlencoded").default;
const dataGet = require("./data-get.js");
var fbToken, userId;

exports.getFbData = function(token, id) {
    fbToken = token;
    userId = id;
}

exports.updateFbTokenDb = function(token) {
    insertData(userId, fbToken, token)
}

function insertData(userId, fbToken, token) {
	var refDb = connectDb.getConnection();
	var sqlUpdateRequest;

	sqlUpdateRequest = 'UPDATE users SET '.concat("facebook_access_token = \'".concat(fbToken), '\', facebook_user_id = \'', userId, '\' WHERE token = \'', token, '\'');
	refDb.query(sqlUpdateRequest , function (tmperror, tmpres, tmpfields) {
		if (tmperror) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (SET):", tmperror);
		}
		else {
			console.log('\x1b[32m', "Facebook token added sucessfully");
		}
    });
}
exports.eventHandler= function(req, res) {
    res.send({
        "hub.challenge": req.query.hub.challenge
    });
}
