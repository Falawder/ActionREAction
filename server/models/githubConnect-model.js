var express = require('express');
var router = express.Router();
var controller = require('../controllers/githubConnect-controller.js');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var connectDb = require("../controllers/db-connect.js");

router.post('/', function(req, res) {
	console.log('\x1b[35m', 'GITHUB CO ROUTE'); 
});

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

var ghConfig = {
	display: "popup",
	clientID: "e16180d6db17a75da9fc",
	clientSecret: "7291a796ac67ec9457659f7138affcfbf99c3911",
	callbackURL: "http://localhost:8080/coucou",
};

passport.use(new GitHubStrategy(ghConfig,
      function(accessToken, refreshToken, profile, callback) {
	controller.getGhData(accessToken, profile.id);
	return callback(null, accessToken);
      }
));

module.exports = router;