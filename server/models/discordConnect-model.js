var express = require('express');
var router = express.Router();
var controller = require('../controllers/discordConnect-controller.js');
var passport = require('passport'), DiscordStrategy = require('passport-discord').Strategy;
var connectDb = require("../controllers/db-connect.js");

passport.use(new DiscordStrategy({
    clientID: "552086334785847296",
    clientSecret: "QMHJZWhLwlaQYLrd292jZ1AgY1Z7MyeH",
    callbackURL: "http://localhost:8080/auth/discord/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        if (profile) {
            user = profile;
            controller.getDdData(accessToken, profile.id);
            return done(null, user);
        } else {
            return done(null, false);
        }
    }
));

module.exports = router;
