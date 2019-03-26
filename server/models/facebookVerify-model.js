var express = require('express');
var router = express.Router();
var controller = require('../controllers/facebookConnect-controller.js');

router.get('/', function(req, res) {
    console.log("facebook verify route");
    controller.eventHandler(req, res);
});

module.exports = router;
