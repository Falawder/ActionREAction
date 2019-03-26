var express = require('express');
var router = express.Router();
var controller = require('../controllers/googlewebhook-controller.js');

router.post('/', function(req, res) {
    console.log("Google webhooks");
    controller.eventHandler(req, res);
});

module.exports = router;
