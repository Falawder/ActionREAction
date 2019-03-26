var express = require('express');
var router = express.Router();
var controller = require('../controllers/log-controller.js');
var controllerNetwork = require('../controllers/log-network-controller.js');
var querystring = require('querystring');
var url = require("url");
const dataGet = require("../controllers/data-get.js");

router.post('/', function(req, res) {
	var urlParams = querystring.parse(url.parse(req.url).query);
	var servicesArray = dataGet.getServices();

	console.log('\x1b[35m', 'LOG ROUTE'); 
	if (("method") in urlParams && urlParams['method'] != '') {
		if (servicesArray.indexOf(urlParams['method']) > -1) {
			controllerNetwork.logNetwork(req, res, urlParams['method']);
		} else if (urlParams['method'] == "app") {
			controller.log(req, res);
		} else {
			repondError(res, "Url param \"method\" invalid");
		}
	} else {
		repondError(res, "Url param \"method\" required");
	}
	
});

function repondError(res, mess) {
	console.log('\x1b[31m', mess);
	res.send({
		"code": 204,
		"failed": mess
	})
}

module.exports = router;