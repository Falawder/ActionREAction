var express = require('express');
var router = express.Router();
var controller = require('../controllers/instagramConnect-controller.js');
var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
var connectDb = require("../controllers/db-connect.js");

router.post('/', function(req, res) {
	console.log('\x1b[35m', 'INSTAGRAM CO ROUTE'); 
});

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new InstagramStrategy({
	clientID: "346c8bbdbebf43d4a5ee3a42192b6d81",
	clientSecret: "a69429ffa57b47dfb066726bad7c4609",
	callbackURL: "http://localhost:8080/auth/instagram/callback"
      },
      function(accessToken, refreshToken, profile, done) {
		if (profile) {
				user = profile;
				controller.getIgData(accessToken, profile.id);
				return done(null, user);
			} else {
				return done(null, false);
			}
		}
));

module.exports = router;