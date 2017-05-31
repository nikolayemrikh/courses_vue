<template>
  <div id="courses" class="container">
    <div class="row">
      <section class="col-md-10">
        <div class="row">
          <ul id="courses-list">
            <li v-for="course in courses">
              <div class="thumbnail">
                <div class="caption">
                  <div class="row">
                    <div class="col-md-10">
                      <h3>
                        <router-link class="btn-link" v-bind:to="{ name: 'tasks', params: { courseNumber: course.courseId } }">{{ course.title }}</router-link>
                        <template v-if="userModel">
                          <template v-if="course.tasks.length > 0">
                            <span class="completed-text">выполнено заданий: </span>
                            <span class="badge">{{ progress(course) }}</span>
                          </template>
                          <template v-if="haveChallenges(course)">
                            <span class="completed-text">пройдено испытаний: </span>
                            <span class="badge">{{ challengesProgress(course) }}</span>
                          </template>
                        </template>
                      </h3>
                      <p>{{ course.description }}</p>
                    </div>
                    <div class="col-md-2">

                    </div>
                    <div class="col-md-2">
                      <div class="row">
                        <template v-if="isAdmin">
                          <button v-on:click.prevent="adminDeleteCourse(course)" type="button" class="btn btn-default">
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                          </button>
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
      <section class="col-md-2">
        Статистика
      </section>
    </div>
  </div>
</template>

<script>
  import request from 'superagent'
  import { mapState, mapGetters, mapActions } from 'vuex'
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
      }),
      ...mapGetters('user', ['isAdmin'])
    },
    methods: {
      ...mapActions('models', [
        'removeCourse'
      ]),
      adminDeleteCourse(currentCourse) {
        let courseId = currentCourse.courseId;
        this.removeCourse({
          courseNumber: courseId
        }).then(res => {
          let index = this.courses.findIndex(el => {
            return el.courseId === courseId
          });
          this.courses.splice(index, 1);
        }).catch(err => console.error(err));
      },
      progress(currentCourse) {
        let courseProgress = this.userModel.coursesProgress.find((cp) => {
//          return cp.course == currentCourse._id // Заменил в модели юзера course на courseId
          return cp.courseId == currentCourse.courseId
        })
        let userCompleted = (courseProgress && courseProgress.completedTasks) ? courseProgress.completedTasks.length : 0
        let tasksQuantity = currentCourse.tasks ? currentCourse.tasks.length : 0
        return userCompleted + ' / ' + tasksQuantity
      },
      challengesProgress(currentCourse) {
        let courseProgress = this.userModel.coursesProgress.find((cp) => {
          return cp.courseId == currentCourse.courseId
        })
        if (!courseProgress) return 0;
        let progressCounter = 0;
        let wholeChallengesCounter = 0;

        for (const i in currentCourse.tasks) {
          let task = currentCourse.tasks[i];
          if (task.isChallenge) wholeChallengesCounter++;
          if (task.isChallenge && courseProgress.completedTasks.find(progressTaskId => {
            console.log(task)
              return progressTaskId == task.taskId
            })) progressCounter++;
        }
        if (wholeChallengesCounter == 0) return;
        return progressCounter + ' / ' + wholeChallengesCounter
      },
      haveChallenges(currentCourse) {
        if (currentCourse.tasks && currentCourse.tasks.length > 0) {
          for (const i in currentCourse.tasks) {
            let task = currentCourse.tasks[i];
            if (task.isChallenge) {
              return true;
            }
          }
        }
      }
    },
    beforeMount() {
      console.log(this.isAdmin)
//      request.get('/api/course').then((res) => {
      request.get('/api/local/course').then((res) => {
        this.courses = res.body.slice()
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
