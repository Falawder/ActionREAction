var connectDb = require("./db-connect.js");
var axios = require("axios");
var FormData = require("form-urlencoded").default;
const dataGet = require("./data-get.js");
var igToken, userId, userToken;

exports.getIgData = function(token, id) {
    ggToken = token;
    userId = id;
}

exports.getToken = function(token) {
	userToken = token;
}


exports.updateIgTokenDb = function() {
    insertData(userId, igToken, userToken)
}

function insertData(userId, igToken, userToken) {
	var refDb = connectDb.getConnection();
	var sqlUpdateRequest;

	sqlUpdateRequest = 'UPDATE users SET '.concat("instagram_access_token = \'".concat(igToken), '\', instagram_user_id = \'', userId, '\' WHERE token = \'', userToken, '\'');
	refDb.query(sqlUpdateRequest , function (tmperror, tmpres, tmpfields) {
		if (tmperror) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (SET):", tmperror);
		}
		else {
			console.log('\x1b[32m', "Instagram token added sucessfully");
		}
    });
}
