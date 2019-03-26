var express = require('express');
var router = express.Router();
var controller = require('../controllers/facebookConnect-controller.js');
var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;
var connectDb = require("../controllers/db-connect.js");

router.post('/', function(req, res) {
	console.log('\x1b[35m', 'FACEBOOK CO ROUTE');
});

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

var fbConfig = {
	display: "popup",
	clientID: "303397383706914",
	clientSecret: "01b848d534da56c221069f2a5af82074",
	callbackURL: "http://localhost:8080/auth/facebook/callback",
	};

passport.use(new FacebookStrategy(fbConfig,
	function(accessToken, refreshToken, profile, callback) {
		controller.getFbData(accessToken, profile.id);
	  	return callback(null, accessToken);
	}
));

module.exports = router;
