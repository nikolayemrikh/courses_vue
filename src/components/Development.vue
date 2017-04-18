<template>
  <div id="development" class="container">
    <div class="row">
      <h1>Development</h1>
      <p>Welcome to development section</p>
      <template v-if="this.model">
        <template v-if="!this.model.githubId && !this.model.bitbucketId">
          <p>Кажется, вы не выполнили вход через сервисы, в которых должны храниться ваши курсы</p>
          <p>Пожалуйста, войдите через один и более сервисов:</p>
        </template>
        <template v-else>
          <p>Вы можете войти еще через один сервис:</p>
        </template>
        <a v-if="!this.model.githubId" href="/api/user/github" class="social-btn"><img class="social-image" src="~assets/github-logo.png"></a>
        <a v-if="!this.model.bitbucketId" href="/api/user/bitbucket" class="social-btn"><img class="social-image" src="~assets/bitbucket-logo.png"></a>
      </template>
      <template v-else="this.model">
        Вам необходимо <router-link to="/login">войти</router-link>, чтобы начать разработку курсов
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
