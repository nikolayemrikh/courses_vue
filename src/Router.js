import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Lending from './components/Lending'
import Login from './components/Login'
import Register from './components/Register'
import Courses from './components/Courses'
import Tasks from './components/Tasks'
import Main from './components/Main'
import EditCourse from './components/EditCourse'
import EditTask from './components/EditTask'

export default new VueRouter({
  routes: [{
    path: '/',
    component: Lending
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/register',
    component: Register
  }, {
    path: '/courses/',
    component: Courses
  }, {
    path: '/courses/:courseNumber',
    component: Tasks,
    beforeEnter: (to, from, next) => {
      next({
        path: '/courses/' + to.params.courseNumber + '/tasks'
      })
    }
  }, {
    path: '/courses/:courseNumber/tasks',
    component: Tasks
  }, {
    path: '/courses/:courseNumber/tasks/:taskNumber',
    component: Main
  }, {
    path: '/edit/courses/:courseNumber',
    component: EditCourse
  }, {
    path: '/edit/courses/:courseNumber/tasks/:taskNumber',
    component: EditTask
  }]
})
