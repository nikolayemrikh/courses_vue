<template>
  <div id="addTask" class="container">
    <form id="add-task" v-on:submit.prevent="submitTask($event.target)">
      <div v-if="createError" class="alert alert-danger" role="alert">{{ createError }}</div>
      <div v-if="createSuccess" class="alert alert-success" role="alert">Задание успешно сохранено!</div>
      <div class="row">
        <div class="form-group">
          <label for="title">Название</label>
          <input name="title" class="form-control" id="title" placeholder="Введите название задания" v-bind:value="proxiedTask.title">
        </div>
        <div class="form-group">
          <label for="description">Описание</label>
          <textarea name="description" class="form-control" rows="3" placeholder="Введите описание">{{ this.proxiedTask.description }}</textarea>
        </div>
        <div class="form-group">
            <label for="theory">Теория</label>
            <textarea name="theory" class="form-control" rows="3" placeholder="Теория">{{ this.proxiedTask.theory }}</textarea>
        </div>
        <div class="form-group">
          <label class="control-label">Испытание</label>
          <input name="challenge" type="checkbox" v-bind:checked="proxiedTask.isChallenge">
        </div>
        <div class="form-group">
          <label class="control-label">Тип задания</label>
          <div class="radios-container" v-on:change="handleTypeToggle">
            <label class="radio-inline"><input type="radio" name="type" value="htmlCssJs" v-bind:checked="proxiedTask.type === 'htmlCssJs'">HTML, CSS, JS</label>
            <label class="radio-inline"><input type="radio" name="type" value="radio" v-bind:checked="proxiedTask.type === 'radio'">Radio</label>
            <label class="radio-inline"><input type="radio" name="type" value="checkbox" v-bind:checked="proxiedTask.type === 'checkbox'">Checkbox</label>
          </div>
        </div>
        <hr>
        <template v-if="proxiedTask.type === 'htmlCssJs'">
          <div class="form-group">
            <label for="initialHTML">Исходный HTML</label>
            <textarea name="initialHTML" class="form-control" rows="3" placeholder="Исходный HTML">{{ this.proxiedTask.initial.html }}</textarea>
          </div>
          <div class="form-group">
            <label class="control-label">Заблокированный HTML</label>
            <input name="blockedHTML" type="checkbox" value="blockedHTML" v-bind:checked="proxiedTask.blockedHTML">
          </div>
          <div class="form-group">
            <label for="initialCSS">Исходный CSS</label>
            <textarea name="initialCSS" class="form-control" rows="3" placeholder="Исходный CSS">{{ this.proxiedTask.initial.css }}</textarea>
          </div>
          <div class="form-group">
            <label class="control-label">Заблокированный CSS</label>
            <input name="blockedCSS" type="checkbox" value="blockedCSS" v-bind:checked="proxiedTask.blockedCSS">
          </div>
          <div class="form-group">
            <label for="initialJS">Исходный JS</label>
            <textarea name="initialJS" class="form-control" rows="3" placeholder="Исходный JS">{{ this.proxiedTask.initial.js }}</textarea>
          </div>
          <div class="form-group">
            <label class="control-label">Заблокированный JS</label>
            <input name="blockedJS" type="checkbox" value="blockedJS" v-bind:checked="proxiedTask.blockedJS">
          </div>
          <hr>
          <div class="form-group">
            <label for="goals">HTML целей</label>
            <textarea name="goals" class="form-control" rows="3" placeholder="HTML целей">{{ this.proxiedTask.goals }}</textarea>
          </div>
          <div class="form-group">
            <label for="checker">Проверяющий JS</label>
            <textarea name="checker" class="form-control" rows="3" placeholder="Проверяющий JS">{{ this.proxiedTask.checker }}</textarea>
          </div>
          <div class="form-group">
            <label class="control-label">Активная вкладка</label>
            <div class="radios-container">
              <label class="radio-inline"><input type="radio" name="activeTab" value="HTML" v-bind:checked="proxiedTask.activeTab === 'HTML'">HTML</label>
              <label class="radio-inline"><input type="radio" name="activeTab" value="CSS" v-bind:checked="proxiedTask.activeTab === 'CSS'">CSS</label>
              <label class="radio-inline"><input type="radio" name="activeTab" value="JS" v-bind:checked="proxiedTask.activeTab === 'JS'">JS</label>
            </div>
          </div>
        </template>
      </div>
      <button type="submit" class="btn btn-default">Сохранить</button>
    </form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { mapActions } from 'vuex'
  import { mapMutations } from 'vuex'
  import request from 'superagent'
  import jsProgramming from './JsProgramming'
  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable
    },
    data() {
      return {
        form: document.forms['add-task'],
        currentView: null,
        files: [],
        proxiedTask: {},
        createSuccess: null,
        createError: null,
        attachError: null,
        attachSuccess: null
      }
    },
    computed: {
      ...mapState('models', [
        'course',
        'task'
      ]),
      ...mapState('user', [
        'model'
      ]),
      draggableOptions() {
        return {
          isDragging: false,
          ghostClass: 'ghost'
        }
      }
    },
    watch: {
      isDragging(newValue) {
        if (newValue) {
          this.delayedDragging = true;
          return;
        }
        this.$nextTick(() => {
          this.delayedDragging = false;
        })
      }
    },
    beforeMount() {
    },
    methods: {
      handleTypeToggle(e) {
        e.preventDefault();
        this.proxiedTask.type = e.target.value;
      },
      filesChanged(files) {
        console.dir(files)
        this.files = files.map((file, i) => {
          file.fixed = false;
          return file;
        });
      },
      attachCourse(form) {
        console.log(form.url)
        let obj = {
          url: form.url.value
        }
        const req = request
          .post('/api/local/course')
          .send(obj);
        req.then(res => {
          this.attachSuccess = true;
          form.reset();
        }).catch(err => {
          this.attachError = err.response.text;
        })
      },
      submitTask(form) {
        this.resetFormStyles();
        const meta = {
          title: form.title.value,
          description: form.description.value,
          theory: form.theory.value,
          isChallenge: form.challenge.checked,
          type: form.type.value,
          courseId: this.course.courseId
        };
        
        let typedMeta = {};
        switch (this.proxiedTask.type) {
          case 'htmlCssJs':
            typedMeta.initialHTML = form.initialHTML.value;
            typedMeta.initialCSS = form.initialCSS.value;
            typedMeta.initialJS = form.initialJS.value;
            typedMeta.blockedHTML = form.blockedHTML.checked;
            typedMeta.blockedCSS = form.blockedCSS.checked;
            typedMeta.blockedJS = form.blockedJS.checked;
            typedMeta.goals = form.goals.value;
            typedMeta.checker = form.checker.value;
            typedMeta.activeTab = form.activeTab.value;
            break;
          case 'checkbox':
            // typedMeta.correctAnswers = ;
            break;
          case 'radio':
            // typedMeta.correctAnswer = ;
            break;
        }
        
        Object.assign(meta, typedMeta);
        
        const req = request.put('/api/local/task/' + Number(this.$route.params.taskNumber)).send(meta);
        
        req.then(res => {
          this.createSuccess = true;
          form.reset();
          this.files = [];
        }).catch(err => {
          this.createError = err.response.text;
        })
      },
      resetFormStyles() {
        this.createSuccess = null;
        this.createError = null;
      }
    },
    beforeDestroy() {
      
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        console.log(vm.$route.params.courseNumber, vm.$route.params.taskNumber)
        if (vm.$route.params.courseNumber && vm.$route.params.taskNumber) {
          vm.proxiedTask = JSON.parse(JSON.stringify(vm.task));
          console.log(vm.task);
        }
      })
    }
  }
</script>
<style scoped>
  #main {
    position: relative;
  }
  .dialog-css .bootstrap-dialog-header {
    font-size: 1.25rem;
  }
  .ghost {
    opacity: .5;
    background: #C8EBFB;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: .5;
    background: #C8EBFB;
  }
  .list-group {
    min-height: 20px;
  }
  .list-group-item {
    cursor: move;
  }
  ul.nav {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 40px;
  }
</style>
