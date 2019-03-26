<template>
 <div id="firebaseui-auth-container" class="google" ></div>   
</template>

<script>
import firebase from 'firebase'
import firebaseui from 'firebaseui'
import {config} from '../helpers/firebaseConfig'
import { myUrl } from '../main.js'

export default {
    data (){
	return {
		user : {
            "firstname" : null ,
            "lastname" : null,
            "user_id" : null ,
            "email" : null,
            "token" : null,
      }
    }},
    created() {
    firebase.initializeApp(config);
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/drive')
  provider.addScope('https://www.googleapis.com/auth/pubsub')
  provider.addScope('https://mail.google.com/') 
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
  provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    firebase.auth().signInWithPopup(provider).then(function(result) {
		var token = result.credential.accessToken;
		var name = result.user.displayName.split(" ")
		localStorage.setItem("firstname", name[0])
		localStorage.setItem("lastname" , name[1])
		localStorage.setItem("email" , result.user.email)
		localStorage.setItem("user_id" , result.user.uid)
		localStorage.setItem("token" , token)
	})
	this.user["firstname"] = localStorage.getItem("firstname");		
	this.user["lastname"] = localStorage.getItem("lastname");		
	this.user["email"] = localStorage.getItem("email");		
	this.user["user_id"] = localStorage.getItem("user_id");		
	this.user["token"] = localStorage.getItem("token");		
  this.$http.post(myUrl + "log?method=google", this.user)                                                                          
	.then((response) => {
	console.log(response);
    })
    var uiConfig = {
     signInSuccessUrl: 'accueil',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ]
      };
    var ui = new firebaseui.auth.AuthUI(firebase.auth());   
    ui.start('#firebaseui-auth-container', uiConfig);   
    }
}
</script>
