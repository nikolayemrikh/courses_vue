<template>
  <div id="app">
    <header v-if="notlending">
      <b-navbar type="light" full>
        <b-nav>
          <router-link to="/" class="navbar-brand">JS Courses</router-link>
        </b-nav>
      </b-navbar>
    </header>
    <router-view class="view"></router-view>
    <footer :if="notlending"></footer>
  </div>
</template>
<script>
  
  export default {
    name: 'App',
    computed: {
      notlending() {
        console.log(this.$route.path != '/')
        return this.$route.path != '/';
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
