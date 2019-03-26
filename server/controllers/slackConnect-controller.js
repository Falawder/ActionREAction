var connectDb = require("./db-connect.js");
var axios = require("axios");
var FormData = require("form-urlencoded").default;

exports.connectHandler = function(req, res){

    var refDb = connectDb.getConnection();

    console.log('CHALLENGE ACCEPTED #slack');
    //console.log(req.body);

    // Resupérer la session du user (body / header de la reqêute)
    const data = {
        client_id: '528553590900.535632309157',
        client_secret: '3d65897f98d1a4e97e04f3739ece2ab5',
        code: req.body.code
    }
  axios({
      method: 'post',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      url:'https://slack.com/api/oauth.access',
      data: FormData(data)

  })
      .then(function (response) {
         console.log(response);
         if (response.data.ok) {
        refDb.query('UPDATE users SET slack_access_token = ?, slack_user_id = ? , slack_uploadtrigger = 0 , slack_reacttrigger = 0 , slack_msgtrigger = 0, slack_postmsg_url = ? WHERE token = ?', [response.data.access_token,response.data.user_id, response.data.incoming_webhook.url,req.body.token], function(error, results, fields) {
      		console.log("error ocurred",error);

          if (error) {
            res.send({
				"code": 204,
				"failed": "[MySQL] Error ocurred (UPDATE)"
			});

          } else {
            res.send({
                "code":200,
                "challenge": req.body.code
            });
          }
        });
    }
    else {
        res.send({
            "code": 400,
            "failed": "code already exists"
        });
    }
  })
  .catch(function (error) {
      console.log(error);
  });
}
