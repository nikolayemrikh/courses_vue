/* eslint-disable */

import Vue from 'vue'
import router from './Router'
import AppView from './App'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import Vuex from 'vuex'
Vue.use(Vuex)

import request from 'superagent'

const user = {
  namespaced: true,
  state: {
    model: null
  },
  mutations: {
    setModel(state, model) {
      state.model = model
    },
    removeModel(state) {
      state.model = null
    }
  },
  getters: {
    getInfo(state) {
      return state.info
    },
    getModel(state) {
      return state.model
    }
  },
  actions: {
    logIn(context, args) {
      return new Promise((resolve, reject) => {
        request.post('/api/user/login')
        .send({
          username: args.username,
          password: args.password
        })
        .then(
          (res) => {
            context.commit('setModel', res.body)
            resolve(res)
            if (!args.redirect)
              app.$router.push('courses')
            else
              app.$router.push(args.redirect)
          },
          (err) => {
            reject(err)
          }
        )
      })
    },
    fetch(context) {
      request.get('/api/user').then(
        (res) => {
          context.commit('setModel', res.body)
        },
        err => console.log(err)
      )
    },
    logOut(context) {
      request.delete('/api/user/' + context.getters.getModel._id).then(
        () => {
          context.commit('removeModel')
        }
      )
    },
    register(context, args) {
      return new Promise((resolve, reject) => {
        request.post('/api/user/').send(args).then(
          (res) => resolve(res),
          (err) => reject(err)
        )
      })
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

store.dispatch('user/fetch')

window.app = app
window.store = store
