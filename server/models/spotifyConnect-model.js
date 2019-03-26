var express = require('express');
var router = express.Router();
var controller = require('../controllers/spotifyConnect-controller.js');

router.post('/', function(req,res) {
    console.log("SpotifyCo route");
    controller.spotiConnectHandler(req, res);
});

module.exports = router;
