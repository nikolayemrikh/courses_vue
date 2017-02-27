<template>
  <div id="register" class="container">
    <h3 class="register-text lead">Register and start learning quickly!</h3>
    <div class="register-section row">
      <section class="col-md-4 col-md-offset-4">
        <!--<div v-bind:class="[info.registerError ? 'panel-danger' : 'panel-info']" class="register-panel panel panel-info">-->
        <div v-bind:class="panelStatus" class="register-panel panel panel-default">
          <div class="panel-body">
            <div v-if="registerError" class="alert alert-danger" role="alert">{{ getIncorrectMessage }}</div>
            <div v-if="registrationSuccess" class="alert alert-success" role="alert">You've successfully registered!</div>
            <form @submit.prevent="onSubmit">
              <div v-bind:class="[registerError && registerError.incorrect.userExists ? 'has-error' : '']" class="form-group">
                <label for="username">Username</label>
                <input v-model="username" type="text" class="form-control" id="username" placeholder="Username">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input v-model="password" type="password" class="form-control" id="password" placeholder="Password">
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input v-model="email" type="email" class="form-control" id="email" placeholder="Email">
              </div>
              <div class="form-group">
                <label for="firstname">First name</label>
                <input v-model="firstname" type="text" class="form-control" id="firstname" placeholder="First name">
              </div>
              <div class="form-group">
                <label for="lastname">Last name</label>
                <input v-model="lastname" type="text" class="form-control" id="lastname" placeholder="Last name">
              </div>
              <div class="form-group">
                <label for="birthday">Birthday</label>
                <input v-model="birthday" type="date" class="form-control" id="birthday" placeholder="Birthday">
              </div>
              <button type="submit" class="btn btn-default btn-block">Submit</button>
            </form>
          </div>
        </div>
      </section>
      <!--<section class="socials col-md-3">-->
        <!--<div class="panel panel-default panel-info">-->
          <!--<div class="panel-body">-->
            <!--<p>Or log in through:</p>-->
            <!--&lt;!&ndash;<router-link to="/api/user/vk"><img class="social-image" src="/assets/vk-logo.png"></router-link>&ndash;&gt;-->
            <!--<a href="/api/user/github"><img class="social-image" src="~assets/github-logo.png"></a>-->
          <!--</div>-->
        <!--</div>-->
      <!--</section>-->
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { mapMutations } from 'vuex'
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
        username: "",
        password: "",
        email: "",
        firstname: "",
        lastname: "",
        birthday: "",
        registerError: null,
        registrationSuccess: false
      }
    },
    methods: {
      ...mapActions('user', [
        'register'
      ]),
      onSubmit(event) {
        this.resetFormStyles()
        this.register({
          username: this.username,
          password: this.password,
          email: this.email,
          firstname: this.firstname,
          lastname: this.lastname,
          birthday: this.birthday
        }).then(res => {
          this.registrationSuccess = true
          event.target.reset()
          setTimeout(() => this.$router.push('/login'), 3000)
        }).catch(err => {
          this.registerError = err.response.body
        })
      },
      resetFormStyles() {
        this.registerError = null
        this.registrationSuccess = false
      }
    },
    computed: {
      ...mapState('user', [
        'model'
      ]),
      getIncorrectMessage() {
        if (this.registerError && this.registerError.incorrect.userExists)
          return "User already exists"
      },
      panelStatus() {
        if (this.registerError)
          return 'panel-danger'
        if (this.registrationSuccess)
          return 'panel-success'
        return 'panel-info'
      }
    }
  }
</script>

<style scoped>
.register-text {
  font-size: 1.5rem;
  text-align: center;
}

.social-image {
  width: 50px;
  height: 50px;
}
</style>
