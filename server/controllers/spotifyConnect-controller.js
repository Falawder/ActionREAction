var connectDb = require("./db-connect.js");
var axios = require("axios");
var FormData = require("form-urlencoded").default;
var request = require("request");

exports.spotiConnectHandler = function(req, res){

  var refDb = connectDb.getConnection();
  var accesstok;

  console.log('CHALLENGE ACCEPTED #spotifyConnect');
  if (!req.body.code) {
    res.send({
      "code": 400,
      "challenge": "Can't get a code"
    })
    return;
  }
  console.log("Code reçu : " + req.body.code);
  console.log(req.body);

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    params: {
      client_id: '9951a02e03e24c21bcc1de83842dbf85',
      client_secret: '70e240e0cf0b4b95bc859635d6afcca9',
      grant_type: 'authorization_code',
      code: req.body.code,
      redirect_uri: 'http://localhost:8081/home/spotify/'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(function (response) {
    accesstok = response.data.access_token;
    console.log("ACCESS_TOKEN : " + accesstok);

    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + accesstok
      }
    })
    .then(function (resp) {
      console.log("USER'S DATA : ");

      if (resp.data) {
        // NEED TO DO MYSQL SETTINGS
        refDb.query('UPDATE users SET spotify_access_token = ?, spotify_user_id = ? WHERE token = ?', [accesstok,resp.data.id,req.body.token], function(error, results, fields) {
          console.log("error ocurred",error);

          if (error) {
            res.send({
              "code":400,
            })

          } else {
            res.send({
              "code":200,
              "challenge": req.body.code
            });
          }

        })
      }
    })
    .catch(function (error) {
      console.log("USER'S DATAS Error : " + error);
      res.send({
        "code": 400,
        "challenge": "Failed to get user's data"
      })
    });
  })
  .catch(function (error) {
    console.log("Error : " + error);
    res.send({
      "code": 400,
      "challenge": "Can't get the access_token"
    })
  });
}
