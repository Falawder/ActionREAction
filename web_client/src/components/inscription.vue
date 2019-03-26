<template>
  <div>
    <b-form>
      <br><br>
      <b-form-group id="exampleInputGroup1">
        <b-form-input
          type="email"
          v-model="user.email"
          required
          placeholder="Mail" />
      </b-form-group>

      <b-form-group id="exampleInputGroup2" label-for="exampleInput2">
        <b-form-input
          type="text"
          v-model="user.lastname"
          required
          placeholder="Enter name" />
      </b-form-group>

      <b-form-group id="exampleInputGroup3" label-for="exampleInput2">
        <b-form-input
          type="text"
          v-model="user.firstname"
          required
          placeholder="Enter name" />
      </b-form-group>
     
      <b-form-group id="exampleInputGroup4" label-for="exampleInput2">
        <b-form-input
          type="password"
          v-model="user.pass"
          required
          placeholder="Mot de passe" />
      </b-form-group>
      <b-button type="text  " @click="inscription" variant="primary">Inscription</b-button>
    </b-form>
  </div>
</template>

<script>
import { myUrl } from '../main.js'
  export default {
    data() {
      return {
        user : {
            "firstname" : null ,
            "lastname" : null,
            "pass" : null ,
            "email" : null
        },
      }
    },
    methods: {
      //"http://area2019.serveo.net/sign"
        inscription: function() {
            this.$http.post("http://localhost:8080/sign", this.user).then((response) => {
              console.log(response.data);
              console.log(this.user);              
              if (response.data.code == "200"){
                this.$router.replace({name : 'auth'})
              }
            })
        }
      },
}
</script>