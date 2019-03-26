import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Auth.vue'
import Inscription from './components/inscription.vue';
import Accueille from './components/Home.vue';
import apk from './components/apkclient.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name : 'auth', component: Home },
    { path: '/home*', name: 'home' , component: Accueille },
    { path: '/accueil', name: 'accueille' , component: Accueille },
    { path: '/inscription', name: 'inscription' , component: Inscription },
    { path: '/client.apk', name: 'apk' , component: apk },
  ]
});