var express = require('express');
var router = express.Router();
var controller = require('../controllers/timeEvent-controller.js');

router.post('/', function(req, res) {
    console.log("Time route");
    controller.everyXminjob(req, res);
});

module.exports = router;
