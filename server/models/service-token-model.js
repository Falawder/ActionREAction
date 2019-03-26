var express = require('express');
var router = express.Router();
var controller = require('../controllers/service-token-controller.js');
var querystring = require('querystring');
var url = require("url");
const dataGet = require("../controllers/data-get.js");

router.post('/', function(req, res) {
	var urlParams = querystring.parse(url.parse(req.url).query);
	var servicesArray = dataGet.getServices();

	console.log('\x1b[35m', 'SERVICE TOKEN ROUTE'); 
	if (("service") in urlParams && urlParams['service'] != '' && servicesArray.indexOf(urlParams['service']) > -1) {
		controller.addToken(req, res, urlParams['service']);
	} else {
		console.log('\x1b[31m', 'Invalid url parameters'); 
		res.send({
			"code": 204,
			"failed": "Invalid url parameters"
		});
	}
});

module.exports = router;