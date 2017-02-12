<template>
  <div id="tasks" class="container">
    <div class="row">
      <section class="col-md-8">
        <div class="row">
          <ul id="tasks-list">
            <li v-for="task in tasks">
              <div class="thumbnail">
                <div class="caption">
                  <div class="row">
                    <div class="col-md-10">
                      <h3>
                        <router-link class="btn-link" v-bind:to="{ path: '/' }">{{ task.taskName }}</router-link>
                      </h3>
                      <p>{{ task.taskDescription }}</p>
                    </div>
                    <div class="col-md-2">
                      <span class="badge">{{ completed(task) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section class="col-md-4">
        Статистика
      </section>
    </div>
  </div>
</template>

<script>
  import request from 'superagent'
  import { mapState } from 'vuex'
  export default {
    name: 'tasks',
    data () {
      return {
        tasks: []
      }
    },
    computed: {
      ...mapState('user', {
        userModel: 'model'
      })
    },
    methods: {
      completed(currentTask) {
        return this.userModel.coursesProgress.find((cp) => {
          return cp.completedTasks.find((ct) => {
            console.log(currentTask._id, ct)
            return ct == currentTask._id
          })
        }) ? 'completed' : ''
      }
    },
    mounted() {
      request.get('/api/course/' + this.$route.params.courseNumber).then((res) => {
        this.tasks = res.body.tasks.slice()
      }).catch((err) => {
        console.error(err)
      })
    }
  }
</script>
<style scoped>
  .caption {
    padding: 2%;
  }
  .caption h3 {
    margin: 0;
  }
  .caption p {
    margin: 12px 0 0 0;
  }
  h3 a {
    cursor: pointer;
  }
  ul {
    list-style: none;
  }
  .completed-text {
    font-size: 1rem;
    font-weight: 300;
  }
</style>
