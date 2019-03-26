var connectDb = require("./db-connect.js");
var axios = require("axios");
var FormData = require("form-urlencoded").default;
const dataGet = require("./data-get.js");
var ddToken, userId, userToken;

exports.getDdData = function(token, id) {
    ddToken = token;
    userId = id;
}

exports.getToken = function(token) {
    userToken = token;
}

exports.updateDdTokenDb = function() {
    insertData(userId, ddToken, userToken)
}

function insertData(userId, ddToken, userToken) {
    var refDb = connectDb.getConnection();
    var sqlUpdateRequest;

    sqlUpdateRequest = 'UPDATE users SET '.concat("discord_access_token = \'".concat(ddToken), '\', discord_user_id = \'', userId, '\' WHERE token = \'', userToken, '\'');
    refDb.query(sqlUpdateRequest , function (tmperror, tmpres, tmpfields) {
        if (tmperror) {
            console.log('\x1b[31m', "[MySQL] Error ocurred (SET):", tmperror);
        }
        else {
            console.log('\x1b[32m', "Discord token added sucessfully");
        }
    });
}
