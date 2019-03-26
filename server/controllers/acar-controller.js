var connectDb = require("./db-connect.js");

exports.acar = function (req,res) {
    var refDb = connectDb.getConnection();
    var resql;
    if (req.query.params) {
        refDb.query('SELECT * FROM users WHERE token = ?', [req.query.params], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
                res.send({
                    "code": 400,
                    "failed": "[MySQL] Error ocurred (SELECT)"
                })
                return;
            } else {
                if (results[0]) {
                var resp = {
                    code: 200,
                    acars : [{
                        actiontitle : "google",
                        action: "googlenotification",
                        reactiontitle : "slack",
                        reaction: "slackpostmsg",
                        description : "If new mail inbox, then post a message in slack's channel",
                        isOn : results[0].googlenotification_trigger
                    }, {
                        actiontitle: "slack",
                        action: "slackreact",
                        reactiontitle: "google",
                        reaction: "sendmail",
                        description: "If a reactiontitle was added to a message, then send a mail",
                        isOn: results[0].slack_reacttrigger
                    }, {
                        actiontitle: "slack",
                        action: "slackupload",
                        reactiontitle: "google",
                        reaction: "googleuploadfile",
                        description: "If someone uploaded a file on slack, then upload it to user's drive",
                        isOn: results[0].slack_uploadtrigger

                    }, {
                        actiontitle: "slack",
                        action: "slackmsg",
                        reactiontitle: "spotify",
                        reaction: "savesong",
                        description: "If someone post a message on slack with a spotify link, then add it to spotify user's track list",
                        isOn:results[0].slack_msgtrigger

                    }, {
                        actiontitle: "time",
                        action: "dayjob",
                        reactiontitle: "spotify",
                        reaction: "createplaylist",
                        description: "If date is X day, then create a X named playlist on spotify",
                        isOn: results[0].oncejob_trigger
                    }, {
                        actiontitle: "time",
                        action:"minjob",
                        reactiontitle: "slack",
                        reaction:"slackpostmsg",
                        description: "Every X minute / sec / day, post a slack message",
                        isOn: results[0].repetitivejob_trigger
                    }]
                }
                res.send(resp);
                return;
            }
        }
        });
    } else {
        res.send({
            "code": 400,
            "failed": "No token given"
        })
        return;
    }


}
