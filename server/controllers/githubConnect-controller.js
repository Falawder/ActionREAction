var connectDb = require("./db-connect.js");
var axios = require("axios");
var FormData = require("form-urlencoded").default;
const dataGet = require("./data-get.js");
var ghToken, userId;

exports.getGhData = function(token, id) {
    ghToken = token;
    userId = id;
}

exports.updateGhTokenDb = function(token) {
    insertData(userId, ghToken, token)
}

function insertData(userId, ghToken, token) {
	var refDb = connectDb.getConnection();
	var sqlUpdateRequest;

	sqlUpdateRequest = 'UPDATE users SET '.concat("github_access_token = \'".concat(ghToken), '\', github_user_id = \'', userId, '\' WHERE token = \'', token, '\'');
	refDb.query(sqlUpdateRequest , function (tmperror, tmpres, tmpfields) {
		if (tmperror) {
			console.log('\x1b[31m', "[MySQL] Error ocurred (SET):", tmperror);
		}
		else {
			console.log('\x1b[32m', "Github token added sucessfully");
		}
	});
}