<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>AREA</span>
        <span class="font-weight-light">'s Epitech project</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn flat href="localhost:8081/home">
        <v-icon>mdi-home</v-icon>
        <span class="mr-2">Home</span>
      </v-btn>

      <v-btn flat @click="openServiceToggles">
        <v-icon>mdi-home</v-icon>
        <span class="mr-2">Services</span>
      </v-btn>

      <v-btn flat href="_blank">
        <v-icon>mdi-information-outline</v-icon>
        <span class="mr-2">About</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <NavBar/>
      <ServiceModal/>
      <ButtonGrid/>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from './NavBar'
import ButtonGrid from './ButtonGrid'
import ServiceModal from './ServiceModal'

export default {
  name: 'App',
  components: {
    NavBar,
    ButtonGrid,
    ServiceModal
  },
  data () {
    return {
      //
    }
  },
  methods: {
    openServiceToggles () {
      this.$modal.show('toggleServices')
    }
  }
}
</script>

<style type="text/css">
</style>