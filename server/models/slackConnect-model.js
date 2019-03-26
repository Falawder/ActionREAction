var express = require('express');
var router = express.Router();
var controller = require('../controllers/slackConnect-controller.js');

router.post('/', function(req, res) {
    console.log("Slack route");
    controller.connectHandler(req, res);
});

module.exports = router;
