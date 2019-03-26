<template>
  <div>
    <v-layout align-center justify-space-around row fill-height>
      <a href="https://accounts.spotify.com/authorize?client_id=9951a02e03e24c21bcc1de83842dbf85&response_type=code&redirect_uri=http://localhost:8081/home/spotify/&scope=user-read-private user-read-email playlist-modify-public playlist-modify-private user-library-modify">
        <div class="applet_insta box">
          <img class="logo" src="../assets/Spotify_logo.png"/>
          <header id="title">Spotify</header>
        </div>
      </a>
      <a v-bind:href=" myUrl + 'auth/facebook?queryParams='+this.$store.state.token" >
        <div class="applet_insta box">
         <img class="logo" src="../assets/Facebook_logo.png"/>
          <header id="title">Facebook</header>
        </div>
      </a>
      <a v-bind:href="'http://localhost:8080/' + 'auth/google?queryParams='+this.$store.state.token">
        <div class="applet_insta box">
          <img class="logo" src="../assets/Google_logo.png"/>
          <header id="title">Google</header>
        </div>
      </a>
    </v-layout>



    <v-layout align-center justify-space-around row fill-height>
      <a href="https://slack.com/oauth/authorize?client_id=528553590900.535632309157&scope=files:read,incoming-webhook,channels:history,reactions:read,channels:read,files:read,users:read">
        <div class="applet_insta box">
          <img class="logo" src="../assets/Slack_logo.png"/>
          <header id="title">Slack</header>
        </div>
      </a>

      <a href="" target="_blank">
        <div class="applet_insta box">
         <img class="logo" src="../assets/Discord_logo.png"/>
          <header id="title">Discord</header>
        </div>
      </a>
      <a href="" target="_blank">
        <div class="applet_insta box">
          <img class="logo" src="../assets/GitLab_logo.png"/>
          <header id="title">GitLab</header>
        </div>
      </a>
    </v-layout>



    <v-layout align-center justify-space-around row fill-height>
      <a href="" target="_blank">
        <div class="applet_insta box">
          <img class="logo" src="../assets/GitHub_logo.png"/>
          <header id="title">GitHub</header>
        </div>
      </a>
    </v-layout>

  </div>
</template>

<script>
  import axios from 'axios'
  import { myUrl } from '../main.js'

  export default {
    data: () => ({
    }),
    created: async function() {
      var currentUrl = window.location.href;
      var splitUrl = currentUrl.split("/");
      this.$store.dispatch('getUserToken', localStorage.getItem('userToken'))
      if (splitUrl[5]) {
        var splitCode = splitUrl[5].split("=");
        var splitState = splitCode[1].split("&");
        try {
          var response = await axios({
            method: 'post',
            url: myUrl + splitUrl[4] +'/connect',
            data: {
              'code': splitState[0],
              'token': this.$store.state.token
            },
            headers: {
              'Content-Type': 'application/json'
            }
          })
          if (response.data.code == 200) {
            let status = {'service': splitUrl[3], 'bool': true}
            this.$store.dispatch('changeServiceStatus', status)
          }
        } catch (err) {
          return;
        }
      }
    }
  }
</script>

<style scoped>
  .box {
    min-width: 100px;
    min-height: 100px;
    margin-bottom: 20px;
  }

  a {
  text-decoration: none;
  color: inherit;
  }
  a:hover {
    color: white;
  }

  .logo {
    width: 130px;
  }

  .applet_insta:hover {
    background-color: grey;
    border-radius: 30px;
  }

  #title {
    font-family: 'Open Sans Condensed', sans-serif;
    font-size: 30px;
    text-align: center;
  }

</style>
