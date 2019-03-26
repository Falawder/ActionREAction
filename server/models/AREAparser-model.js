var express = require('express');
var router = express.Router();
var controller = require('../controllers/AREAparser-controller.js');

router.post('/', function(req, res) {
	console.log('AREA ROUTE');
	controller.eventParser(req, res);
});

module.exports = router;
