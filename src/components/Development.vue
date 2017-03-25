<template>
  <div id="development" class="container">
    <div class="row">
      <h1>Development</h1>
      <p>Welcome to development section</p>
      <template v-if="this.model">
        <template v-if="!this.model.githubId && !this.model.bitbucketId">
          <p>It looks like you haven't bind your github or bitbucket account to local account here</p>
          <p>Please, follow one or more next links and start</p>
        </template>
        <template v-else>
          <p>You can bind your local account to another service</p>
        </template>
        <a v-if="!this.model.githubId" href="/api/user/github" class="social-btn"><img class="social-image" src="~assets/github-logo.png"></a>
        <a v-if="!this.model.bitbucketId" href="/api/user/bitbucket" class="social-btn"><img class="social-image" src="~assets/bitbucket-logo.png"></a>
      </template>
      <template v-else="this.model">
        You have to <router-link to="/login">sign in</router-link> to start developing courses
      </template>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { mapGetters } from 'vuex'
  import { mapActions } from 'vuex'
  import { mapMutations } from 'vuex'
  import request from 'superagent'

  export default {
    data() {
      return {
      }
    },
    computed: {
      ...mapState('user', [
        'model'
      ]),
      ...mapState('models', [
        'course',
        'task'
      ])
    },
    beforeMount() {
      
    },
    methods: {
      
    },
    beforeDestroy() {
      
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.model && vm.model.githubId && vm.model.bitbucketId) {
          vm.$router.push({
            name: 'manageCourses'
          })
        }
      })
    }
  }
</script>
<style scoped>
  .social-image {
    width: 50px;
    height: 50px;
  }
  
  .social-btn {
    cursor: pointer;
  }
</style>
