<template>
  <div id="tasks" class="container">
    <div class="row">
      <section class="col-md-9">
        <div class="row">
          <ul id="tasks-list">
            <li v-for="task in tasks">
              <div class="thumbnail">
                <div class="caption">
                  <div class="row">
                    <div class="col-md-10">
                      <h3>
                        <router-link class="btn-link" v-bind:to="`/courses/${course.courseId}/tasks/${task.taskId}`">{{ task.title }}</router-link>
                      </h3>
                      <p>{{ task.description }}</p>
                    </div>
                    <div class="col-md-2">
                      <div class="row">
                        <template v-if="userModel">
                          <span class="badge badge-challenge">{{ task.isChallenge ? 'challenge' : '' }}</span>
                        </template>
                        <template v-if="userModel">
                          <span class="badge">{{ completed(task) }}</span>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section class="col-md-3">
        Статистика
      </section>
    </div>
  </div>
</template>

<script>
  import request from 'superagent'
  import { mapState } from 'vuex'
  import { mapActions } from 'vuex'
  import { mapMutations } from 'vuex'
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
      }),
      ...mapState('models', [
        'course',
        'task'
      ])
    },
    methods: {
      completed(currentTask) {
        return this.userModel.coursesProgress.find((cp) => {
          if (cp.courseId !== this.$route.params.courseNumber || !cp.completedTasks.length) return;
          if (cp.completedTasks.indexOf(currentTask.taskId) !== -1) return true;
          
        }) ? 'completed' : '';
      },
      editTask(task) {
        console.log(task)
      },
      deleteTask(task) {
        console.log(task)
      }
    },
    beforeMount() {
      this.tasks = this.course.tasks;
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
