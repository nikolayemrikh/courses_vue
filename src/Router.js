import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Lending from './components/Lending'
import Login from './components/Login'
import Register from './components/Register'
import Courses from './components/Courses'
import Tasks from './components/Tasks'
import Main from './components/Main'
import ManageCourses from './components/ManageCourses'
import ManageTasks from './components/ManageTasks'
import EditCourse from './components/EditCourse'
import EditTask from './components/EditTask'
import Development from './components/Development'
import AddCourse from './components/AddCourse'

export default new VueRouter({
  routes: [{
    path: '/',
    component: Lending
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/register',
    component: Register
  }, {
    path: '/courses/',
    name: 'courses',
    component: Courses,
  }, {
    path: '/courses/:courseNumber?',
    component: Tasks,
    beforeEnter: (to, from, next) => {
      next({
        path: '/courses/' + to.params.courseNumber + '/tasks'
      })
    }
  }, {
    path: '/courses/:courseNumber/tasks',
    name: 'tasks',
    component: Tasks,
  }, {
    path: '/courses/:courseNumber/tasks/:taskNumber',
    name: 'main',
    component: Main,
    meta: { requiresAuth: true }
  }, {
    path: '/development/',
    name: 'development',
    component: Development
  }, {
    path: '/development/courses/',
    name: 'manageCourses',
    component: ManageCourses,
    meta: { requiresAuth: true }
  }, {
    path: '/development/courses/addcourse',
    name: 'addCourse',
    component: AddCourse,
    meta: { requiresAuth: true }
  }, {
    path: '/development/courses/:courseNumber?',
    component: Tasks,
    beforeEnter: (to, from, next) => {
      next({
        path: '/manage/courses/' + to.params.courseNumber + '/tasks'
      })
    },
    meta: { requiresAuth: true }
  }, {
    path: '/development/courses/:courseNumber/tasks/',
    name: 'manageTasks',
    component: ManageTasks,
    meta: { requiresAuth: true }
  }, {
    path: '/development/courses/:courseNumber/tasks/:taskNumber',
    name: 'manageMain',
    component: Main,
    meta: { requiresAuth: true }
  }, {
    path: '*',
    redirect: '/'
  }]
})
