/* eslint-disable */

import Vue from 'vue'
import router from './Router'
import AppView from './App'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import Vuex from 'vuex'
Vue.use(Vuex)

import VueHead from 'vue-head'
Vue.use(VueHead)

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
    getModel(state) {
      return state.model
    }
  },
  actions: {
    logIn(context, args) {
      return new Promise((resolve, reject) => {
        request
          .post('/api/user/login')
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
      return new Promise((resolve, reject) => {
        request.get('/api/user').then(
          res => {
            context.commit('setModel', res.body)
            resolve();
          },
          err => reject(err)
        )
      });
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

const models = {
  namespaced: true,
  state: {
    course: null,
    task: null
  },
  mutations: {
    setCourse(state, args) {
      state.course = args.course;
    },
    setTask(state, args) {
      state.task = args.task;
    }
  },
  getters: {

  },
  actions: {
    loadCourse(context, args) {
      return new Promise((resolve, reject) => {
        request.get(`/api/local/course/${args.courseNumber}`).then((res) => {
          context.commit('setCourse', {
            course: res.body
          });
          resolve(context.state.course)
        }).catch(err => reject(err));
      });
    },
    loadTask(context, args) {
      return new Promise((resolve, reject) => {
        request.get(`/api/local/course/${args.courseNumber}/task/${args.taskNumber}`).then(res => {
          context.commit('setTask', {
            task: res.body
          });
          resolve(context.state.task)
        }).catch(err => reject(err));
      });
    }
  }
}

const store = new Vuex.Store({
  modules: {
    user,
    models
  }
})

router.beforeEach((to, from, next) => {
  if (to.params.taskNumber && !store.state.models.task) {
    let args = {
      courseNumber: to.params.courseNumber,
      taskNumber: to.params.taskNumber
    }
    store.dispatch('models/loadTask', args).then(task => {
      next();
    }).catch(err => next());
  }
  else next();
})

router.beforeEach((to, from, next) => {
  if (to.params.courseNumber && !store.state.models.course) {
    console.log(to)
    let args = {
      courseNumber: to.params.courseNumber
    }
    store.dispatch('models/loadCourse', args).then(course => next()).catch(err => next());
  }
  else next();
})

router.beforeEach((to, from, next) => {
  if (!to.params.courseNumber && store.state.models.course) {
    store.commit('models/setCourse', {
      course: null,
    });
    next();
  }
  else next();
});

router.beforeEach((to, from, next) => {
  if (!to.params.taskNumber && store.state.models.task) {
    store.commit('models/setTask', {
      task: null
    })
    next();
  }
  else next();
});

const app = new Vue({
  template: '<AppView/>',
  components: {
    AppView
  },
  router,
  store
})//.$mount('#app')

store.dispatch('user/fetch').then(res => {
  app.$mount('#app');
}).catch(err => {
  app.$mount('#app');
});

window.app = app
window.store = store
