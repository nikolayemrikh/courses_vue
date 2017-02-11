<template>
  <div id="login" class="container">
    <h3 class="login-text lead">Log in local or through socials and start learning quickly!</h3>
    <div class="login-section row">
      <section class="col-md-3 col-md-offset-3">
        <div v-bind:class="[info.err ? 'panel-danger' : 'panel-info']" class="login-panel panel panel-default">
          <div class="panel-body">
            <div v-if="info.err" class="alert alert-danger" role="alert">{{ getIncorrectMessage }}</div>
            <form @submit.prevent="onSubmit">
              <div v-bind:class="[info.err && info.err.incorrect.username ? 'has-error' : '']" class="form-group">
                <label for="username">Login</label>
                <input v-model="proxyUsername" type="text" class="form-control" id="username" placeholder="Enter login">
              </div>
              <div v-bind:class="[info.err && info.err.incorrect.password ? 'has-error' : '']" class="form-group">
                <label for="password">Password</label>
                <input v-model="proxyPassword" type="password" class="form-control" id="password" placeholder="Enter password">
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
            <a href="/profile/vk"><img class="vk-image" src="../assets/vk-logo.png"></a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { mapGetters } from 'vuex'
  import { mapState } from 'vuex'
  export default {
    data () {
      return {
        username: "",
        password: ""
      }
    },
    methods: {
      ...mapActions('user', [
        'logIn' //async/await
      ]),
      async onSubmit() {
        this.info.err = null
        await this.logIn({
          username: this.username,
          password: this.password,
          redirect: '/'
        })
      }
    },
    computed: {
      ...mapState('user', [
        'info',
        'model'
      ]),
      getIncorrectMessage() {
        if (this.info.err && this.info.err.incorrect.username)
          return "Incorrect username"
        if (this.info.err && this.info.err.incorrect.password)
          return "Incorrect password"
      },
      proxyUsername: {
        get() {
          return this.info.logged ? '' : this.username
        },
        set(value) {
          this.username = value
        }
      },
      proxyPassword: {
        get() {
          return this.info.logged ? '' : this.password
        },
        set(value) {
          this.password = value
        }
      }
    }
  }
</script>

<style>
.login-text {
  font-size: 1.5rem;
  margin-top: 5%;
  text-align: center;
}
.login-section {
  margin-top: 10%;
}

.vk-image {
  width: 50px;
  height: 50px;
}
</style>
