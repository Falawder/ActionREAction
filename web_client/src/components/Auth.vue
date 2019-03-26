<template lang="html">
<div class="container">
  <h1> Area </h1>
  <google></google>
  <fb></fb>
  <br><br>
  <login></login>
  </div>
</template>
  
<script>
import login from "./login.vue"
import fb from "./fb.vue"
import google from "./google.vue"

export default {
  name: 'auth',
  components : {
    login,
    fb,
    google,
  },
}

</script>

<style lang="css">
.google{
  margin-right: 90%;
  margin-left: 39%;
}
body{
	background-image:  url("../assets/fond4 6.jpg")
}
</style>
