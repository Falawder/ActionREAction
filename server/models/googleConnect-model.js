var express = require('express');
var router = express.Router();
var controller = require('../controllers/googleConnect-controller.js');
var passport = require('passport'), GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var connectDb = require("../controllers/db-connect.js");

router.post('/', function(req, res) {
	console.log('\x1b[35m', 'GOOGLE CO ROUTE');
});

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new GoogleStrategy({
	clientID: "601970742952-u25d9jicjkdp4qg7ifkedu15nl9gbmrs.apps.googleusercontent.com",
	clientSecret: "3KujiwmrQJxgHir1ia69I76l",
	callbackURL: "http://localhost:8080/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
		if (profile) {
				user = profile;
				controller.getGgData(accessToken, profile.id,profile.emails[0].value);
				return done(null, user);
			} else {
				return done(null, false);
			}
		}
));

module.exports = router;
