<template>
  <div id="js-programming">
    <div class="row">
      <div class="col-md-6">
        <div class="panel panel-default">
          <div class="panel-heading">Блок вопросов</div>
          <div class="panel-body panel-theory"></div>
        </div>
      </div>
      <form v-on:submit.prevent="check" name="questions-form" action="">
        <div class="col-md-6">
          <div class="panel panel-default">
            <div class="panel-body">
                <ul class="questions list-unstyled">
                  <li v-for="(question, index) in questions">
                  <template v-if="radio">
                    <div class="radio">
                      <label>
                        <input type="radio" name="radios" id="optionsRadios1" v-bind:value="index">
                        {{question}}
                      </label>
                    </div>
                  </template>
                  <template v-if="checkbox">
                    <div class="checkbox">
                      <label>
                        <input type="checkbox" v-bind:value="index">
                        {{question}}
                      </label>
                    </div>
                  </template>
                  </li>
                </ul>
            </div>
            <div class="panel-footer">
              <button type="submit" class="btn btn-default btn-check">Check</button>
              <div class="pull-right">
                <router-link class="btn btn-default btn-next" v-bind:to="`/courses/${this.$route.params.courseNumber}/tasks/${Number(this.$route.params.taskNumber) + 1}`">Next</router-link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'radioCheckbox',
    data() {
      return {
        radio: false,
        checkbox: false,
        questions: {}
      }
    },
    mounted() {
      this.buttonNext = document.querySelector('.btn-next');
      this.buttonCheck = document.querySelector('.btn-check');
      this.task = this.$parent.task;
      this.course = this.$parent.course;
      console.log(this.course, this.task)
      switch (this.task.type) {
        case 'radio':
          this.radio = true;
          break;
        case 'checkbox':
          this.checkbox = true;
          break;
      }
      this.questions = this.task.initial.questions;
      document.querySelector('.panel-theory').innerHTML = this.task.theory;
    },
    methods: {
      check(e) {
        let solved = false;
        switch (this.task.type) {
          case 'radio':
            let answer = e.target.radios.value;
            
            if (this.task.correctAnswer == answer) solved = true;
            break;
          case 'checkbox':
            let answers = Array.from(e.target.querySelectorAll('input[type="checkbox"]')).filter(el => el.checked).map(el => el.value);
            answers.sort((a,b) => a-b);
            this.task.correctAnswers.sort((a,b) => a-b);
            if (this.task.correctAnswers.length === answers.length &&
              this.task.correctAnswers.every((val, index) => {
                console.log(val, answers[index])
                return val == answers[index];
              })) solved = true;
            break;
        }
        if (!solved) return;
        
        this.$parent.setSolved((err, res) => {
          if (res || err === 'Already solved') {
            this.buttonNext.classList.add('btn-success');
            this.buttonCheck.classList.add('disabled');
          }
        })
      }
    },
    beforeDestroy() {
    }
  }
</script>
<style scoped>
  
  
</style>
