/* eslint-disable */

import Vue from 'vue'
import router from './Router'
import AppView from './App'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import Vuex from 'vuex'
Vue.use(Vuex)


// import App_example from './App_example'
// new Vue({
//   //el: '#app',
//   template: '<App_example/>',
//   components: { App_example }
// }).$mount('#app')

import request from 'superagent'


const user = {
  namespaced: true,
  state: {
    model: {},
    info: {
      logged: false,
      err: null
    }
  },
  mutations: {
    login(state, {
      err,
      user
    }) {
      if (err) {
        state.info.logged = false
        state.info.err = JSON.parse(err.response.text)
      }
      else {
        state.user = user;
        state.info.logged = true;
      }
    }
  },
  actions: {
    async login(context, user) {
      await request.post('/api/user')
        .send({
          username: user.username,
          password: user.password
        })
        .then(
          (user) => context.commit('login', {
            null,
            user
          }),
          (err) => context.commit('login', {
            err,
            null
          })
        )
    }
  },
  getters: {
    getInfo(state) {
      return state.info;
    }
  }
}

const store = new Vuex.Store({
  modules: {
    user
  }
})

const app = new Vue({
  template: '<AppView/>',
  components: {
    AppView
  },
  router,
  store
}).$mount('#app')
