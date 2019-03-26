<template>
  <v-container  id="mainlogo">
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex xs12>
        <v-img
          :src="require('../assets/logoArea.png')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>
      <v-layout align-center justify-space-around row fill-height/>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    
  }
</script>

<style>
#mainlogo {
  margin-top: -45px;
}
</style>
