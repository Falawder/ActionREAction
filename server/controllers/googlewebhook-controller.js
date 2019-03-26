var axios = require("axios");
var connectDb = require("./db-connect.js");
var slack = require("./slackEvent-controller.js")

exports.eventHandler = function(req, res){
    var refDb = connectDb.getConnection();
    console.log(req.body.message.data);
    let buff = new Buffer(req.body.message.data, 'base64');
    let text = buff.toString('ascii');
    var obj = JSON.parse(text);
    console.log(obj);

    refDb.query('SELECT * FROM users WHERE google_user_mail = ?', [obj.emailAddress], function(error, results, fields) {
        if (error) {
            console.log(error);
            console.log("Not logged to Google");
        }
        else {
            console.log(results[0]);
            if (results[0] && results[0].googlenotification_trigger) {
                    slack.postslackmsg(results,{text: obj.emailAddress+" has a new email"});
            }
        }
    });
    res.sendStatus(200);
}

exports.google_notification = function(res, reaction, results, arg) {
    var refDb = connectDb.getConnection();
    if (results[0] && results[0].googlenotification_trigger) {
        res.send({
            "code": 200,
            "error": "AREA successfully deactivated"
        })
        refDb.query('UPDATE users SET googlenotification_trigger = ? WHERE google_user_id = ?', [false,results[0].google_user_id], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
            } else {
                console.log('\x1b[32m', 'Updated google upload trigger');
            }
        });
    } else {
        res.send({
            "code": 200,
            "error": "AREA successfully activated"
        });
        axios({
          method: 'post',
          url: 'https://www.googleapis.com/gmail/v1/users/'+results[0].google_user_id+'/watch',
          headers: {
              "Authorization" : "Bearer "+ results[0].google_access_token
          },
          data:{
              topicName: "projects/area-231012/topics/area",
              labelIds: ["UNREAD"]
          }
      })
      .then(function(response){
          refDb.query('UPDATE users SET googlenotification_trigger = ? WHERE google_user_id = ?', [true,results[0].google_user_id], function(error, results, fields) {
              if (error) {
                  console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
              } else {
                  console.log("Sucessfully sub to project" + response);
                  console.log('\x1b[32m', 'Updated google upload trigger');

              }
          });
      })
      .catch(function(error){
          console.log(error.response.data);
      })
      ;

    }

}
