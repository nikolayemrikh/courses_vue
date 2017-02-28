<template>
  <div id="login">
    <h3 class="login-text lead">Sign in local or through socials and start learning quickly!</h3>
    <div class="login-section row">
      <section class="col-md-3 col-md-offset-3">
        <div v-bind:class="[loginError ? 'panel-danger' : 'panel-info']" class="login-panel panel panel-default">
          <div class="panel-body">
            <div v-if="loginError" class="alert alert-danger" role="alert">{{ getIncorrectMessage }}</div>
            <form @submit.prevent="onSubmit">
              <div v-bind:class="[loginError && loginError.incorrect.username ? 'has-error' : '']" class="form-group">
                <label for="username">Login</label>
                <input v-model="username" type="text" class="form-control" id="username" placeholder="Enter login">
              </div>
              <div v-bind:class="[loginError && loginError.incorrect.password ? 'has-error' : '']" class="form-group">
                <label for="password">Password</label>
                <input v-model="password" type="password" class="form-control" id="password"
                       placeholder="Enter password">
              </div>
              <button type="submit" class="btn btn-default btn-block">Submit</button>
            </form>
          </div>
        </div>
      </section>
      <section class="socials col-md-3">
        <div class="panel panel-default panel-info">
          <div class="panel-body">
            <p>Socials:</p>
            <!--<a href="/profile/vk"><img class="social-image" src="../assets/vk-logo.png"></a>-->
            <!--<a v-on:click.prevent="githubAuth" class="social-btn"><img class="social-image" src="~assets/github-logo.png"></a>-->
            <a href="/api/user/github" class="social-btn"><img class="social-image" src="~assets/github-logo.png"></a>
            <a href="/api/user/bitbucket" class="social-btn"><img class="social-image" src="~assets/bitbucket-logo.png"></a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { mapMutations } from 'vuex'
  import { mapGetters } from 'vuex'
  import { mapState } from 'vuex'
  export default {
    data () {
      return {
        username: "",
        password: "",
        loginError: null
      }
    },
    methods: {
      ...mapActions('user', [
        'logIn',
        //не работает
        'githubAuth'
      ]),
      onSubmit(event) {
        let form = event.target
        this.logIn({
          username: this.username,
          password: this.password
        }).then((res) => {
          form.reset()
        }).catch((err) => {
          this.loginError = err.response.body
        })
      }
    },
    computed: {
      ...mapState('user', [
        'model'
      ]),
      getIncorrectMessage() {
        if (this.loginError && this.loginError.incorrect.username)
          return "Incorrect username"
        if (this.loginError && this.loginError.incorrect.password)
          return "Incorrect password"
      }
    }
  }
</script>

<style scoped>
  .login-text {
    font-size: 1.5rem;
    margin-top: 5%;
    text-align: center;
  }

  .login-section {
    margin-top: 10%;
  }

  .social-image {
    width: 50px;
    height: 50px;
  }
  
  .social-btn {
    cursor: pointer;
  }
</style>
