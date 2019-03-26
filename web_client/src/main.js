import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import store from './store.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.config.productionTip = false

//boot
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
//

//axios
import axios from 'axios'
import VueAxios from 'vue-axios'

//export const myUrl = 'http://localhost:8080/'
export const myUrl = 'http://area2019.serveo.net/'
Vue.use(VueAxios, axios)
//


//fb
import FBSignInButton from 'vue-facebook-signin-button'
Vue.use(FBSignInButton)
//

//modal
import VModal from 'vue-js-modal'
Vue.use(VModal)
//

//toggle
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)
//

new Vue({
  router,
  store,
render: h => h(App)
}).$mount('#app')
