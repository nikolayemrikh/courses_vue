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
              <li v-bind:class="{ active: isCourses && !isDevelopment }"><router-link to="/courses">Список курсов</router-link></li>
              <li v-bind:class="{ active: isDevelopment }"><router-link to="/development">Разработка</router-link></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <template v-if="userModel">
                <li><a v-on:click.prevent href="#">{{ username }}</a></li>
                <li><a v-on:click.prevent="logOut" href="#">Выйти</a></li>
              </template>
              <template v-else="userModel">
                <li v-if="this.$route.path != '/login'"><router-link to="/login">Вход</router-link></li>
                <li v-if="this.$route.path != '/register'"><router-link to="/register">Регистрация</router-link></li>
              </template>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <div v-bind:class="{'container-fluid': notLending}">
      <ol v-if="isCoursesOrTasks" class="breadcrumb">
        <li v-if="this.isDevelopment"><router-link to="/development">Разработка</router-link></li>
        <template v-if="this.isDevelopment ? this.isGitOrBitBinded : true">
          <li><router-link v-bind:to="`${this.isDevelopment ? '/development' : ''}/courses`">{{ this.isDevelopment ? "Ваши курсы" : "Курсы" }}</router-link></li>
          <li v-if="this.course">{{ this.courseName }}</li>
          <li v-if="this.$route.name === 'addCourse'">Добавить курс</li>
          <li v-if="this.course"><router-link v-bind:to="`${this.isDevelopment ? '/development' : ''}/courses/${this.$route.params.courseNumber}/tasks/`">Задания</router-link></li>
          <li v-if="this.$route.name === 'addTask'">Добавить задание</li>
          <li v-if="this.task">{{ this.taskName }}</li>
        </template>
      </ol>
      <router-view class="view"></router-view>
    </div>
    <footer :if="notLending"></footer>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { mapActions } from 'vuex'
  import { mapGetters } from 'vuex'
  export default {
    name: 'App',
    computed: {
      ...mapState('user', {
        userModel: 'model',
      }),
      ...mapState('models', [
        'course',
        'task'
      ]),
      ...mapGetters('user', [
        'isGitOrBitBinded'
      ]),
      courseName() {
        return this.course.title;
      },
      taskName() {
        return this.task.title;
      },
      notLending() {
        return this.$route.path != '/'
      },
      isCourses() {
        return this.$route.path.includes('courses')
      },
      isDevelopment() {
        return this.$route.path.includes('development')
      },
      isCoursesOrTasks() {
        return this.$route.path.indexOf('courses') != -1 || this.$route.path.indexOf('tasks') != -1 || this.$route.path.indexOf('development') != -1;
      },
      username() {
        if (this.userModel.firstname && this.userModel.lastname)
          return this.userModel.firstname + ' ' + this.userModel.lastname;
        else return this.userModel.username;
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
  
  .badge {
    background-color: rebeccapurple;
  }
  
  .badge + .badge {
    margin-top: 10px;
  }
  
  .badge.badge-challenge {
    background-color: #449d44;
  }
</style>
