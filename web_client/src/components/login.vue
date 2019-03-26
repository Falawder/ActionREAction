<template>
<div id="login">
    <b-input v-model="user.email" id="inlineFormInputGroupUsername2" placeholder="Mail" type="email" />
    <b-input v-model="user.pass" class="mb-2 mr-sm-2 mb-sm-0" id="inlineFormInputName2" type="password" placeholder="Mot de passe" />
    <br>
    <b-button @click="connection" variant="primary">Connection</b-button>
    &nbsp;
    <b-button @click="inscription" variant="primary">Inscription</b-button>
    <br><br>
    <b-button @click="force" variant="primary">Force</b-button>
</div>
</template>

<script>
import { myUrl } from '../main.js'

export default {
    name : "login",
    data () {
        return {
            user : {
                "email" : null,
                "pass" : null
            }
        }   
    },
    methods : {
        connection : function () {
            console.log(this.user);
                //this.$http.post("http://area2019.serveo.net/log?method=app", this.user).then((response) => {
                this.$http.post("http://localhost:8080/log?method=app", this.user).then((response) => {
                console.log(response.data)
                if (response.data.code == "200"){
                    this.$store.dispatch('getUserToken', response.data.token)
                    localStorage.setItem('userToken', response.data.token)
                    this.$router.replace({name : 'accueille'})
                 }
                else{
                    this.$router.replace({name : 'auth'})
                }
            })
        },
        inscription : function () {
            this.$router.replace({name : 'inscription'})
        },
        force : function () {
            this.$router.replace({name : 'accueille'})
        },
    }
}
</script>
