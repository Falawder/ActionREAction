var axios = require("axios");

exports.spotifycreateplaylist = function (results, arg) {
    console.log("creating playlist");
    axios({
      method: 'post',
      url: 'https://api.spotify.com/v1/users/'+results[0].spotify_user_id+'/playlists',
      headers: {
          "Authorization" : "Bearer "+ results[0].spotify_access_token
      },
      data:{
          name: arg.name ? arg.name : "superplaylist"
      }
  })
  .then(function(response){
      console.log("successfully created playlist");
  })
  .catch(function(error){
      console.log(error.response.data);
  })
  ;
}

exports.savesong = function (results, link) {
    console.log("saving song");

    axios({
      method: 'put',
      url: 'https://api.spotify.com/v1/me/tracks',
      headers: {
          "Authorization" : "Bearer "+ results[0].spotify_access_token
      },
      params:{
          ids: link
      }
  })
  .then(function(response){
      console.log("successfully created playlist");
  })
  .catch(function(error){
      console.log(error.response.data);
  })
}
