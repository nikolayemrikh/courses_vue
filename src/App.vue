<template>
  <div id="app">
    <header v-if="notLending">
      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <router-link to="/" class="navbar-brand">JS Courses</router-link>
          </div>
          <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
              <li v-bind:class="{ active: isCourses }"><router-link to="/courses">Courses list</router-link></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <template v-if="model">
                <li><a v-on:click.prevent href="#">{{ this.model.firstname + ' ' + this.model.lastname }}</a></li>
                <li><a v-on:click.prevent="logOut" href="#">Log out</a></li>
              </template>
              <template v-else="model">
                <li v-if="this.$route.path != '/login'"><router-link to="/login">Log in</router-link></li>
                <li v-if="this.$route.path != '/register'"><router-link to="/register">Register</router-link></li>
              </template>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <div v-bind:class="{'container-fluid': notLending}">
      <ol v-if="isCoursesOrTasks" class="breadcrumb">
        <li><router-link to="/courses">Courses</router-link></li>
        <li v-if="this.$route.params.courseNumber">{{this.$route.params.courseNumber}}</li>
        <li v-if="this.$route.params.courseNumber"><router-link v-bind:to="`/courses/${this.$route.params.courseNumber}/tasks/`">Tasks</router-link></li>
        <li v-if="this.$route.params.taskNumber">{{this.$route.params.taskNumber}}</li>
      </ol>
      <router-view class="view"></router-view>
    </div>
    <footer :if="notLending"></footer>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { mapActions } from 'vuex'
  export default {
    name: 'App',
    computed: {
      ...mapState('user', [
        'model'
      ]),
      notLending() {
        return this.$route.path != '/'
      },
      isCourses() {
        return this.$route.path == '/courses' || this.$route.path == '/courses/'
      },
      isCoursesOrTasks() {
        return this.$route.path.indexOf('courses') != -1 || this.$route.path.indexOf('tasks') != -1;
      }
    },
    methods: {
      ...mapActions('user', [
        'logOut'
      ])
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
    font-weight: 300;
    line-height: 1.5;
    color: #292b2c;
    background-color: #ffffff;
  }
</style>
