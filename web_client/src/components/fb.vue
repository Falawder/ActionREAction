<template>
  <fb-signin-button
    :params="fbSignInParams"
    @success="onSignInSuccess"
    @error="onSignInError" style="margin-left:40%;margin-right:40%">
    Connection Facebook
  </fb-signin-button>
</template>
 
<script>
import { myUrl } from '../main.js'
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '765221470509910',
      cookie     : true, 
      xfbml      : true,  
      version    : 'v2.8' 
    });
  };
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
export default {
  data () {
    return {
      user : {
            "firstname" : null ,
            "lastname" : null,
            "user_id" : null ,
            "email" : null,
            "token" : null,
      },  
      fbSignInParams: {
        scope: 'email,user_likes',
        return_scopes: true
      }
    }
  },
  methods: {     
    onSignInSuccess (response) {
        var accessToken = response.authResponse.accessToken;
        this.user["token"] = accessToken;
        FB.api('/me', 'GET' , { fields: 'id, first_name, last_name, email' }, 
        userInformation => {
        this.user["firstname"] = userInformation.first_name;
        this.user["lastname"] = userInformation.last_name;
        this.user["email"] = userInformation.email;
        this.user["user_id"] = userInformation.id;
        this.$http.post( myUrl + "log?method=facebook", this.user)                                                                          
            .then((response) => {
            console.log(response);
            if (response.data.code == "200"){
              this.$store.dispatch('getUserToken', response.data.token)
              localStorage.setItem('userToken', response.data.token)
              this.$router.replace({name : 'accueille'})
            }
            else{
              this.$router.replace({name : '/'})
            }
        })
      })    
    },
    onSignInError (error) {
      console.log('OH NOES', error)
    }
  }
}
</script> 
 
<style>
.fb-signin-button {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
}
</style> 