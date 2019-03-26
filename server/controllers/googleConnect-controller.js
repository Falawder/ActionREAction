var connectDb = require("./db-connect.js");
var axios = require("axios");
var FormData = require("form-urlencoded").default;
const dataGet = require("./data-get.js");
var ggToken, userId, userToken, useremail;

exports.getGgData = function(token, id, email) {
    ggToken = token;
    userId = id;
    useremail = email
}

exports.getToken = function(token) {
	userToken = token;
}


exports.updateGgTokenDb = function() {
    insertData(userId, ggToken, userToken, useremail);
}

function insertData(userId, ggToken, userToken, useremail) {
	var refDb = connectDb.getConnection();
	var sqlUpdateRequest;

	sqlUpdateRequest = 'UPDATE users SET '.concat("google_access_token = \'".concat(ggToken), '\', google_user_id = \'', userId, '\' WHERE token = \'', userToken, '\'');
	refDb.query(sqlUpdateRequest , function (tmperror, tmpres, tmpfields) {
		if (tmperror) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (SET):", tmperror);
		}
		else {
			console.log('\x1b[32m', "Google token added sucessfully");
		}
    });
}
