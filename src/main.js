/* eslint-disable */

import Vue from 'vue'
import router from './Router'
import AppView from './App'

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);



// import App_example from './App_example'
// new Vue({
//   //el: '#app',
//   template: '<App_example/>',
//   components: { App_example }
// }).$mount('#app')


const app = new Vue({
  template: '<AppView/>',
  components: {
    AppView
  },
  router
}).$mount('#app')