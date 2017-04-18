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
      <section class="section-achieves col-md-3">
        Достижения
        <div v-if="!alreadyAchieved.halfCourse && !alreadyAchieved.fullCourse" class="no-achieves">
          Нет достижений
        </div>
        <div class="achieves-list">
          <div v-bind:class="{'achieves-list-item_showed': alreadyAchieved.halfCourse}" class="achieves-list-item half">
            <p class="achieves-list-item__title"></p>
            <img>
            <p class="achieves-list-item__alert"></p>
          </div>
          <div v-bind:class="{'achieves-list-item_showed': alreadyAchieved.fullCourse}" class="achieves-list-item full">
            <p class="achieves-list-item__title"></p>
            <img>
            <p class="achieves-list-item__alert"></p>
          </div>
        </div>
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
        tasks: [],
        alreadyAchieved: {
          halfCourse: false,
          fullCourse: false
        }
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
    },
    mounted() {
      let halfContainer = document.querySelector('.achieves-list-item.half');
      if (halfContainer) {
        halfContainer.querySelector('img').setAttribute('src', this.course.filesDirName + '/' + this.course.achieves.halfCourse.imageSrc);
        halfContainer.querySelector('.achieves-list-item__title').innerText = this.course.achieves.halfCourse.title;
        halfContainer.querySelector('.achieves-list-item__alert').innerText = this.course.achieves.halfCourse.alert;
        this.halfContainer = halfContainer;
      }
      
      let fullContainer = document.querySelector('.achieves-list-item.full');
      if (fullContainer) {
        fullContainer.querySelector('img').setAttribute('src', this.course.filesDirName + '/' + this.course.achieves.fullCourse.imageSrc);
        fullContainer.querySelector('.achieves-list-item__title').innerText = this.course.achieves.fullCourse.title;
        fullContainer.querySelector('.achieves-list-item__alert').innerText = this.course.achieves.fullCourse.alert;
        this.fullContainer = fullContainer;
      }

      for (let cp of this.userModel.coursesProgress) {
        if (cp.courseId === this.$route.params.courseNumber) {
          if (cp.achieves) {
            if (cp.achieves.fullCourse) this.alreadyAchieved.fullCourse = true;
            if (cp.achieves.halfCourse) this.alreadyAchieved.halfCourse = true;
          }
        }
      }
      console.log(this.alreadyAchieved.halfCourse)
    },
    head: {
      base() {
        return [{
          // href: `/static/courses/${this.task.courseDirName}/${this.task.taskDirName}/`
          href: `/static/courses/${this.course.courseId}/`
        }]
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        console.log("TASKS")
        for (let cp of vm.userModel.coursesProgress) {
          if (cp.courseId === vm.$route.params.courseNumber) {
            if (cp.achieves) {
              if (cp.achieves.fullCourse) vm.alreadyAchieved.fullCourse = true;
              if (cp.achieves.halfCourse) vm.alreadyAchieved.halfCourse = true;
            }
          }
        }
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
  .achieves-list-item_showed {
    display: flex!important;
  }
  .achieves-list .achieves-list-item {
    display: none;
    margin-top: 30px;
    padding: 10px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 0 10px 0 rebeccapurple;
    border-radius: 4px;
  }
  .section-achieves {
    text-align: center;
  }
  .no-achieves {
    display: none;
  }
</style>
