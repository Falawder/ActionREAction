var express = require("express");
var app = express();
var https = require('https');
var net = require('net');
var fs = require('fs');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
const logModel = require("./models/log-model.js");
const signModel = require("./models/sign-model.js");
const serviceTokenModel = require("./models/service-token-model.js");
const slackModel = require("./models/slackEvent-model.js");
const slackCoModel = require("./models/slackConnect-model.js");
const spotifyCoModel = require("./models/spotifyConnect-model.js");
//const spotifyModel = require("./models/spotifyEvent-model.js");
const facebookCoModel = require("./models/facebookConnect-model.js");
const facebookVerifyModel = require("./models/facebookVerify-model.js");
var facebookController = require('./controllers/facebookConnect-controller.js');
const timetest = require("./models/timeEvent-model.js");
const areaparser = require("./models/AREAparser-model.js");
const githubCoModel = require("./models/githubConnect-model.js");
var githubController = require('./controllers/githubConnect-controller.js');
var InstagramStrategy = require('passport-instagram').Strategy;
const instagramCoModel = require("./models/instagramConnect-model.js");
var instagramController = require('./controllers/instagramConnect-controller.js');
var dbConnect = require("./controllers/db-connect.js");
var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;//, GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleCoModel = require("./models/googleConnect-model.js");
var googleController = require('./controllers/googleConnect-controller.js');
var errorHandler = require('errorhandler')
var DiscordStrategy = require('passport-discord').Strategy;
var discordCoModel = require('./models/discordConnect-model.js');
var discordController = require('./controllers/discordConnect-controller.js');
var CronJob = require('cron').CronJob;
var test = require('./controllers/googlefileupload-controller.js');
var googleSubModel = require('./models/googleSub-model.js');
var about = require('./controllers/about.js');
var acar = require('./controllers/acar-controller.js')
var DiscordStrategy = require('passport-discord').Strategy;
var discordCoModel = require('./models/discordConnect-model.js');
var discordController = require('./controllers/discordConnect-controller.js');
var discordBot = require('./models/discordBot-model.js')
const _dirname = "/usr/app/server"

const {PubSub} = require('@google-cloud/pubsub');

dbConnect.dbConnect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'GET,POST');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(passport.initialize());
app.use(passport.session());


app.use('/log', logModel);
app.use('/sign', signModel);

app.use('/time', timetest);

app.use('/service-token', serviceTokenModel);

app.use('/parser', areaparser) ;

app.use('/slack', slackModel);
app.use('/slack/connect', slackCoModel);


app.use('/google/sub', googleSubModel);

app.get('/about.json', function(req,res) {
    about.about(req,res);
});

app.get('/acar', function (req, res) {
    console.log("ACAR");
	acar.acar(req, res);
});

app.get('/google682d788b17d89b0f.html', function(req, res) {
    var page = fs.readFile('./google682d788b17d89b0f.html', function (err, html) {
    if (err) {
        throw err;
        }
    else {
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
        }
    })
});

//app.use('/spotify', spotifyModel);
app.use('/spotify/connect', spotifyCoModel);

app.get('/facebook/verify', function(req, res) {
    return res.send(req.query['hub.challenge'])
})

app.use('/service-token', serviceTokenModel);

app.get('/auth/discord', function (req, res, next) {
	// var callbackURL = "http://localhost:8080/auth/discord/callback";
	var callbackURL = "/auth/discord/callback";

	discordController.getToken(req.query.queryParams);
	passport.authenticate('discord', { scope: ['identify'], callbackURL: callbackURL})(req, res, next);
});

app.get('/auth/discord/callback', function (req, res, next) {
	passport.authenticate('discord', {failureRedirect: '/login' })
	(req, res, next) },
	function (req, res) {
		discordController.updateDdTokenDb();
		res.redirect('/');
});

app.get("/auth/facebook", function(req, res, next) {
	// var callbackURL = "http://localhost:8080/auth/facebook/callback" + "?queryParams=" + req.query.queryParams;
	var callbackURL = "/auth/facebook/callback" + "?queryParams=" + req.query.queryParams;
	passport.authenticate("facebook", { scope : ["email"], callbackURL: callbackURL })(req, res, next);
});

app.get("/auth/facebook/callback", function(req, res, next) {
	passport.authenticate("facebook", {
		// callbackURL: "http://localhost:8080/auth/facebook/callback" + "?queryParams=" + req.query.queryParams,
		callbackURL: "/auth/facebook/callback" + "?queryParams=" + req.query.queryParams,
		failureRedirect: "/login",
		session: false
	})(req, res, next) },
	function(req, res) {
		facebookController.updateFbTokenDb(req.query.queryParams);
		res.redirect('/');
});

app.get("/auth/github", function(req, res, next) {
	// var callbackURL = "http://localhost:8080/auth/github/callback" + "?queryParams=" + req.query.queryParams;
	var callbackURL = "/auth/github/callback" + "?queryParams=" + req.query.queryParams;
	passport.authenticate("github", { scope : ["email"], callbackURL: callbackURL })(req, res, next);
});

app.get("/auth/github/callback", function(req, res, next) {
	passport.authenticate("github", {
		// callbackURL: "http://localhost:8080/auth/github/callback" + "?queryParams=" + req.query.queryParams,
		callbackURL: "/auth/github/callback" + "?queryParams=" + req.query.queryParams,
		failureRedirect: "/login",
		session: false
	})(req, res, next) },
	function(req, res) {
		githubController.updateGhTokenDb(req.query.queryParams);
		res.redirect('/');
});

app.get('/auth/instagram', function(req, res, next) {
	// var callbackURL = "http://localhost:8080/auth/instagram/callback";
	var callbackURL = "/auth/instagram/callback";

	instagramController.getToken(req.query.queryParams);
	passport.authenticate('instagram', { callbackURL: callbackURL })(req, res, next);
});

app.get('/auth/instagram/callback', function(req, res, next) {
	passport.authenticate('instagram', { failureRedirect: '/login' })
	(req, res, next) },
  	function(req, res) {
		instagramController.updateIgTokenDb();
    		res.redirect('/');
});

app.get('/auth/google', function(req, res, next) {
	var callbackURL = "/auth/google/callback";
	//var callbackURL = "/auth/google/callback";

	googleController.getToken(req.query.queryParams);
	passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/pubsub','https://mail.google.com/', 'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'], callbackURL: callbackURL })(req, res, next);
});

app.get('/auth/google/callback', function(req, res, next) {
	passport.authenticate('google', { failureRedirect: '/login' })
	(req, res, next) },
  	function(req, res) {
		googleController.updateGgTokenDb();
    		res.redirect('http://localhost:8081/accueil');
});

app.get('/auth/discord', function (req, res, next) {
	var callbackURL = "http://localhost:8080/auth/discord/callback";
	passport.authenticate('discord', { scope: ['identify'], callbackURL: callbackURL})(req, res, next);
});

app.get('/auth/discord/callback', function (req, res, next) {
	passport.authenticate('discord', {failureRedirect: '/login' })
	(req, res, next) },
	function (req, res) {
		discordController.updateDdTokenDb();
		res.redirect('/');
});

app.use(express.static('./apk'));

app.use(errorHandler({ log: errorNotification }));

function errorNotification(err, str, req) {
  console.log('ERROR', err);
}

http.listen(8080, function () {
    console.log('\x1b[32m', '[Listen 8080...]');
})


// app.get("/auth/google", function(req, res, next) {
// 	var callbackURL = "http://localhost:8080/auth/google/callback";// + "?queryParams=" + req.query.queryParams;
// 	googleController.updateGgTokenDb(req.query.queryParams);
// 	passport.authenticate("google", { scope : ["email"], callbackURL: callbackURL })(req, res, next);
// });

// app.get("/auth/google/callback", function(req, res, next) {
// 	passport.authenticate("google", {
// 		callbackURL: "http://localhost:8080/auth/google/callback" + "?queryParams=" + req.query.queryParams,
// 		failureRedirect: "/login",
// 		session: false
// 	})(req, res, next) },
// 	function(req, res) {
// 		res.redirect('/');
// });
