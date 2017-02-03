<template>
  <div id="app">
    <header v-if="notLending">
      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <router-link to="/" class="navbar-brand">JS Courses</router-link>
          </div>
          <!-- Залогинен -->
          <div v-if="loggedIn" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
              <li v-bind:class="{ active: isCourses }"><router-link to="/courses">Courses list</router-link></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <li><router-link to="/">Log out</router-link></li>
            </ul>
          </div>
          <!-- Не залогинен -->
          <div v-else="loggedIn" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
              <li v-bind:class="{ active: isCourses }"><router-link to="/courses">Courses list</router-link></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <li v-if="this.$route.path != '/login'"><router-link to="/login">Log in</router-link></li>
              <li v-if="this.$route.path != '/register'"><router-link to="/register">Register</router-link></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <ol v-if="isCoursesOrTasks" class="breadcrumb">
      <li><router-link to="/courses">Courses</router-link></li>
      <li v-if="this.$route.params.courseNumber">{{this.$route.params.courseNumber}}</li>
      <li v-if="this.$route.params.courseNumber"><router-link to="/tasks" class="btn-link-yellow">Tasks</router-link></li>
      <li v-if="this.$route.params.taskNumber">{{this.$route.params.taskNumber}}</li>
    </ol>
    <router-view class="view"></router-view>
    <footer :if="notLending"></footer>
  </div>
</template>
<script>
  var logged = false;
  export default {
    name: 'App',
    computed: {
      notLending() {
        return this.$route.path != '/'
      },
      isCourses() {
        return this.$route.path == '/courses' || this.$route.path == '/courses/'
      },
      loggedIn() {
        return logged;
      },
      isCoursesOrTasks() {
        return this.$route.path.indexOf('courses') != -1 || this.$route.path.indexOf('tasks') != -1;
      }
    }
  }
</script>
<style>
  /*@import "../node_modules/bootstrap/dist/css/bootstrap.min.css";*/
  html {
    font-size: 1rem;
  }
  
  body {
    margin: 0;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #292b2c;
    background-color: #fff;
  }
</style>
