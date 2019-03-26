var fs = require("fs");
var dataJson = fs.readFileSync(__dirname + "/../config/area-data.json");
var data = JSON.parse(dataJson);

exports.getServices = function() {	  
	return(data["services"]);
}

exports.getfbAuth = function() {
	return(data["fbAuth"]);
}