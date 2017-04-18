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
    },
    setCoursesProgress(state, cp) {
      state.model.coursesProgress = cp;
    }
  },
  getters: {
    getModel(state) {
      return state.model ? state.model : null
    },
    isGitOrBitBinded(state) {
      return state.model && (state.model.githubId || state.model.bitbucketId)
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
          router.push({
            name: 'courses'
          })
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
    },
    setSolvedTask(context, {courseNumber, taskNumber, achieveNames}) {
      console.log(achieveNames)
      let userId = context.state.model._id;
      let userCoursesProgress = context.state.model.coursesProgress;
      
      let index = null;
      if (userCoursesProgress && userCoursesProgress.length) {
        index = userCoursesProgress.findIndex(el => {
          console.log(el.courseId, courseNumber)
          if (el.courseId === courseNumber) return el;
        });
        if (index === -1) {
          userCoursesProgress.push({
            completedTasks: [taskNumber],
            courseId: courseNumber
          });
        } else {
          if (!userCoursesProgress[index].completedTasks) userCoursesProgress[index].completedTasks = [];
          userCoursesProgress[index].completedTasks.push(taskNumber);
        }
      } else {
        index = 0;
        userCoursesProgress = [{
          courseId: courseNumber,
          completedTasks: [taskNumber]
        }];
      }
      if (achieveNames) {
        if (!userCoursesProgress[index].achieves) userCoursesProgress[index].achieves = {};
        for (let achieveName of achieveNames) {
          userCoursesProgress[index].achieves[achieveName] = true;
        }
      }
      console.log(achieveNames, userCoursesProgress)
      let args = {
        coursesProgress: userCoursesProgress
      };
      
      return new Promise((resolve, reject) => {
        request.put(`/api/user/${userId}`).send(args).then(
          (res) => {
            context.commit('setCoursesProgress', userCoursesProgress);
            resolve(res);
          },
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
    },
    removeCourse(context, {courseNumber}) {
      // return new Promise((resolve, reject) => {
        return request.delete(`/api/local/course/${courseNumber}`);
      // });
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
  if (to.params.taskNumber && (!store.state.models.task || store.state.models.task.taskNumber !== to.params.taskNumber)) {
    let args = {
      courseNumber: to.params.courseNumber,
      taskNumber: to.params.taskNumber
    }
    store.dispatch('models/loadTask', args).then(task => {
      console.log(task)
      next();
    }).catch(err => next());
  }
  else next();
})

router.beforeEach((to, from, next) => {
  if (to.params.courseNumber && (!store.state.models.course || store.state.models.course.courseNumber !== to.params.courseNumber)) {
    console.log(to)
    let args = {
      courseNumber: to.params.courseNumber
    }
    store.dispatch('models/loadCourse', args).then(course => next()).catch(err => next());
  }
  else next();
})

router.beforeEach((to, from, next) => {
  console.log(to)
  if (!to.params.taskNumber && !to.params.courseNumber && store.state.models.course) {
    console.log('NO-COURSE')
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // этот путь требует авторизации, проверяем залогинен ли
    // пользователь, и если нет, перенаправляем на страницу логина
    if (!store.state.user.model) {
      next({
        name: 'login'
      })
    } else {
      next();
    }
  } else {
    next();
  }
})

window.app = app
window.store = store
