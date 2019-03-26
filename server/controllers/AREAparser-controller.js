var connectDb = require("./db-connect.js");
var timerea = require("./timeEvent-controller.js");
var slack = require("./slackEvent-controller.js");
var googlefun = require("./googlewebhook-controller.js");
var spotify = require("./spotifyEvent-controller.js")
var reaction = {
    slackpostmsg: slack.postslackmsg,
    createplaylist: spotify.spotifycreateplaylist,
    googleuploadfile : "pass",
    sendmail : "pass",
    savesong : "pass" ,
}
var action = {
    minjob: timerea.repetitivejob,
    dayjob: timerea.oncejob,
    slackupload: slack.slack_uploaded,
    slackreact: slack.slack_react,
    slackmsg: slack.slack_msg,
    googlenotification: googlefun.google_notification
}


check_user_info = function(req, res, results, type) {
    if (results[0]) {
        console.log(type);
        console.log(req.body[type]);
        if (req.body[type] === "time") {
            return true;
        }
        if (results[0][req.body[type] + '_access_token'] != null) {
            if (results[0][req.body[type] + '_user_id'] != null) {
                return true;
            } else {
                res.send({
                    "code": 400,
                    "error": "Cannot access "+type+"user service id"
                })
                return false;
            }
        } else {
            res.send({
                "code": 400,
                "error": "User has not access_token (not logged in to "+type+" service)"
            })
            return false;
        }
    }
}

exports.eventParser = function(req,res) {
    accesstoken = req.body.token;
    var refDb = connectDb.getConnection();
    var arg;
    refDb.query('SELECT * FROM users WHERE token = ?', [req.body.token], function (error, results, fields) {
        console.log(error);
        if (error) {
            res.send({
                "code": 400,
                "error": "User has no token (not logged in)"
            })
        } else {
            console.log(results[0]);;
            if (results[0] && check_user_info(req, res, results, 'actiontitle') && check_user_info(req, res, results, 'reactiontitle')) {
                // got action + reaction info need to link Action and REAction function
                console.log(action[req.body.action]);
                console.log("request body");
                console.log(req.body);
                if (req.body.arg) {
                    arg = req.body.arg;
                } else {
                    arg = null;
                }
                if (action[req.body.action] && reaction[req.body.reaction]) {
                    action[req.body.action](res, reaction[req.body.reaction], results, arg)
                    console.log(req.body.action+'_trigger');
                    console.log(results[0][req.body.action+'_trigger']);
                }
                else {
                    console.log(action[req.body.action]);
                    console.log(reaction[req.body.reaction]);
                    res.send({
                        "code": 400,
                        "error": "invalid request"
                    })
                }
            }
        }
    });
}
