var express = require('express');
var router = express.Router();
var controller = require('../controllers/slackEvent-controller.js');

router.post('/', function(req, res) {
    console.log("Slack route");
    controller.eventHandler(req, res);
});

module.exports = router;
