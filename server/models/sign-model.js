var express = require('express');
var router = express.Router();
var controller = require('../controllers/sign-controller.js');

router.post('/', function(req, res) {
	console.log('\x1b[35m', 'SIGN ROUTE'); 
	controller.sign(req, res);
});

module.exports = router;