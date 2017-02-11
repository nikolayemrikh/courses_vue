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
    logIn(state, {
      err,
      user
    }) {
      if (err) {
        state.info.logged = false
        state.info.err = err.response.text
      }
      else {
        state.model = user;
        state.info.logged = true;
      }
    },
    logOut(state) {
      state.model = {}
      state.info.logged = false
      state.info.err = null
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
    async logIn(context, args) {
      await request.post('/api/user')
        .send({
          username: args.username,
          password: args.password
        })
        .then(
          (res) => {
            context.commit('logIn', {
              null,
              user: JSON.parse(res.text)
            })
            // if (!args.redirect)
              app.$router.push('courses')
            // else
            //   app.$router.push(args.redirect)
          },
          (err) => context.commit('logIn', {
            err: JSON.parse(err),
            null
          })
        )
    },
    fetch(context) {
      request.get('/api/user').then(
        (res) => {
          context.commit('logIn', {
            null,
            user: JSON.parse(res.text)
          })
        },
        (res) => context.commit('logIn', {
          err: JSON.parse(res.text),
          null
        })
      )
    },
    logOut({dispatch, commit, getters, rootGetters}) {
      console.log(getters.getModel)
      request.delete('/api/user/' + getters.getModel._id).then(
        () => {
          commit('logOut')
        }
      )
    }
    // logOut(context) {
    //   console.log(context)
    //   request.delete('/api/user').query({username: context.getters.getModel()._id}).then(
    //     () => {
    //       context.commit('logOut')
    //     }
    //   )
    // }
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
