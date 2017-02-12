<template>
  <div id="courses" class="container">
    <div class="row">
      <section class="col-md-8">
        <div class="row">
          <ul id="courses-list">
            <li v-for="course in courses">
              <div class="thumbnail">
                <div class="caption">
                  <div class="row">
                    <div class="col-md-10">
                      <h3>
                        <router-link class="btn-link" v-bind:to="{ name: 'courses', params: { courseNumber: course.courseId } }">{{ course.name }}</router-link>
                        <span class="completed-text">progress: </span>
                        <span class="badge">{{ progress(course) }}</span>
                      </h3>
                      <p>{{ course.description }}</p>
                    </div>
                    <div class="col-md-2">
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
    name: 'courses',
    data () {
      return {
        courses: []
      }
    },
    computed: {
      ...mapState('user', {
        userModel: 'model'
      })
    },
    methods: {
      progress(currentCourse) {
        let courseProgress = this.userModel.coursesProgress.find((cp) => {
          return cp.course == currentCourse._id
        })
        let userCompleted = (courseProgress && courseProgress.completedTasks) ? courseProgress.completedTasks.length : 0
        let tasksQuantity = currentCourse.tasks ? currentCourse.tasks.length : 0
        return userCompleted + ' / ' + tasksQuantity
      }
    },
    beforeRouteEnter (to, from, next) {
      next((vm) => {
        request.get('/api/course').then((res) => {
          vm.courses = res.body.slice()
        }).catch((err) => {
          console.error(err)
        })
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
