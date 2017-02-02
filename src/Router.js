import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Lending from './components/Lending'
import Login from './components/Login'
import Register from './components/Register'
import Start from './components/Start'
import Main from './components/Main'

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
    path: '/start',
    component: Start
  }, {
    path: '/main',
    component: Main
  }]
})
