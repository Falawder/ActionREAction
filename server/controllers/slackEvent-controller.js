var connectDb = require("./db-connect.js");
var axios = require("axios");
var https = require('https');
var path = require('path')
var fs = require('fs');
var googlefile = require('./googlefileupload-controller.js');
var googlemail = require('./googlemail-controller.js');
var spotiEvent = require('./spotifyEvent-controller.js')

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

exports.eventHandler = function(req, res){
    var refDb = connectDb.getConnection();

    console.log('CHALLENGE ACCEPTED #slack');
    console.log(req.body);
    res.send({
        "code":200,
        "challenge": req.body.challenge
    });
    if (req.body.type === "event_callback") {
        console.log(req.body.event);
        if (req.body.event.type === "reaction_added") {
            refDb.query('SELECT * FROM users WHERE slack_user_id = ?', [req.body.event.item_user], function(error, results, fields) {
                if (error) {
                    console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
                    res.send({
                        "code": 400,
                        "failed": "[MySQL] Error ocurred (SELECT)"
                    })
                } else {
                    if (results[0] && results[0].slack_reacttrigger) {
                        // launch here reaction function possibly multiple boolean for multiple function
                        googlemail.sendmail(results[0].email, req.body.reaction);
                        console.log("reaction trigger and activated in the db")
                    }
                }
            });
        }
        else if (req.body.event.type === "file_shared") {
            refDb.query('SELECT * FROM users WHERE slack_user_id = ?', [req.body.event.user_id], function(error, results, fields) {
                if (error) {
                    console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
                    res.send({
                        "code": 400,
                        "failed": "[MySQL] Error ocurred (SELECT)"
                    })
                }
                else {
                    if (results[0] && results[0].slack_uploadtrigger) {
                        // launch here reaction function possibly multiple boolean for multiple function
                        axios({
                            method: 'get',
                            url: '	https://slack.com/api/files.info',
                            params: {token: results[0].slack_access_token,
                                    file: req.body.event.file_id}
                        })
                        .then( function(response) {
                            console.log(response);
                            var filename = response.data.file.name;
                            download(response.data.file.permalink_public, filename, function check(error) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log("slack file downloaded");
                                }
                            });

                            googlefile.googleuploadfile(results[0].token, filename);
                        })
                        .catch( function(error) {
                            console.log(error);
                        });
                        console.log("reaction trigger and (file shared) activated in the db")
                    }
                    else {
                        console.log("recieved reaction trigger (file shared) for a user but trigger deactivated in db");
                    }
                }
            });
        }
        else if (req.body.event.type === "message") {
            console.log("MESSAGE SLACK !");
            var spotilink;
            if (req.body.event.text.startsWith('/ spotify')) {
                console.log("/ spotify detected");
                spotilink = req.body.event.text.slice(42, -1);
                console.log(spotilink);
                refDb.query('SELECT * FROM users WHERE slack_user_id = ?', [req.body.event.user], function(error, results, fields) {
                    if (error) {
                        console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
                        res.send({
                            "code": 400,
                            "failed": "[MySQL] Error ocurred (SELECT)"
                        })
                    } else {
                        if (results[0]) {
                            console.log('Go to savesong');
                            spotiEvent.savesong(results, spotilink);
                        }
                    }
                });
            }
        }
        // Parse other events -> check in db for userid wich reaction is activated
    }
}

exports.postslackmsg = function(results, arg) {

    var refDb = connectDb.getConnection();
    console.log(results[0].slack_postmsg_url);
    const slackBody = {
        mkdwn: true,
        attachments: [
            arg
        ]
    };
    axios({
        method: 'post',
        url: results[0].slack_postmsg_url,
        data: arg ? arg : {text: "Ceci est un message"}

    })
}

exports.slack_uploaded = function(res, reaction, results, arg) {
    var refDb = connectDb.getConnection();
    if (results[0] && results[0].slack_uploadtrigger) {
        res.send({
            "code": 200,
            "error": "AREA successfully deactivated"
        });
        refDb.query('UPDATE users SET slack_uploadtrigger = ? WHERE slack_user_id = ?', [false,results[0].slack_user_id], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
            } else {
                console.log('\x1b[32m', 'Updated slack upload trigger');
            }
        });
    } else {
        res.send({
            "code": 200,
            "error": "AREA successfully activated"
        });
        refDb.query('UPDATE users SET slack_uploadtrigger = ? WHERE slack_user_id = ?', [true,results[0].slack_user_id], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
            } else {
                console.log('\x1b[32m', 'Updated slack upload trigger');
            }
        });
    }
}

exports.slack_react = function(res, reaction, results, arg) {
    var refDb = connectDb.getConnection();
    if (results[0] && results[0].slack_reacttrigger) {
        res.send({
            "code": 200,
            "error": "AREA successfully deactivated"
        })
        refDb.query('UPDATE users SET slack_reacttrigger = ? WHERE slack_user_id = ?', [false,results[0].slack_user_id], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
            } else {
                console.log('\x1b[32m', 'Updated slack react trigger');
            }
        });
    } else {
        res.send({
            "code": 200,
            "error": "AREA successfully activated"
        })
        refDb.query('UPDATE users SET slack_reacttrigger = ? WHERE slack_user_id = ?', [true,results[0].slack_user_id], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
            } else {
                console.log('\x1b[32m', 'Updated slack react trigger');
            }
        });
    }
}

exports.slack_msg = function(res, reaction, results, arg) {
    var refDb = connectDb.getConnection();
    if (results[0] && results[0].slack_msgtrigger) {
        res.send({
            "code": 200,
            "error": "AREA successfully deactivated"
        });
        refDb.query('UPDATE users SET slack_msgtrigger = ? WHERE slack_user_id = ?', [false,results[0].slack_user_id], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
            } else {
                console.log('\x1b[32m', 'Updated slack message trigger');
            }
        });
    } else {
        res.send({
            "code": 200,
            "error": "AREA successfully activated"
        });
        refDb.query('UPDATE users SET slack_msgtrigger = ? WHERE slack_user_id = ?', [true,results[0].slack_user_id], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
            } else {
                console.log('\x1b[32m', 'Updated slack message trigger');
            }
        });
    }

}
