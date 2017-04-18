<template>
  <div id="addCourse" class="container">
    <ul v-on:click="handleNavToggle" class="nav nav-pills">
      <li v-bind:class="{active: activeTabs.create}" data-type="create" role="presentation"><a href="#">Создать новый репозиторий</a></li>
      <li v-bind:class="{active: activeTabs.attach}" data-type="attach" role="presentation"><a href="#">Прикрепить существющий</a></li>
    </ul>
    <template v-if="activeTabs.create">
      <form v-on:submit.prevent="submitCourse($event.target)">
        <div v-if="createError" class="alert alert-danger" role="alert">{{ createError }}</div>
        <div v-if="createSuccess" class="alert alert-success" role="alert">Курс успешно создан!</div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="title">Название</label>
              <input name="title" class="form-control" id="title" placeholder="Введите название курса">
            </div>
            <div class="form-group">
              <label for="description">Описание</label>
              <textarea name="description" class="form-control" rows="3" placeholder="Enter description"></textarea>
            </div>
            <div class="form-group">
              <label class="control-label">VCS сервис</label>
              <div>
                <label class="radio-inline"><input type="radio" name="service" id="bitbucket" value="bitbucket" checked>Bitbucket</label>
                <label class="radio-inline"><input type="radio" name="service" id="github" value="github">Github</label>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="files">Файлы</label>
              <p class="help-block">Скрипты JS, стили CSS и изображения, которые будут загружены на страницу каждого задания</p>
              <div class="row">
                <div class="col-md-3">
                  <label class="btn btn-default btn-file">
                    Прикрепить <input name="files" v-on:change="filesChanged(Array.from($event.target.files))" type="file" multiple id="files" style="display: none">
                  </label>
                </div>
                <div class="col-md-9">
                  <draggable v-if="files.length" class="list-group" element="ul" :options="draggableOptions"  v-model="files" @start="isDragging=true" @end="isDragging=false">
                    <transition-group type="transition" :name="'flip-list'">
                      <li class="list-group-item" v-for="element in files" :key="element.name">
                        {{element.name}}
                      </li>
                    </transition>
                  </draggable>
                  <p v-else="files" class="help-block">Нет прикрепленных файлов</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-default">Создать</button>
        </form>
    </template>
    <template v-if="activeTabs.attach">
      <form v-on:submit.prevent="attachCourse($event.target)">
        <div v-if="attachError" class="alert alert-danger" role="alert">{{ attachError }}</div>
        <div v-if="attachSuccess" class="alert alert-success" role="alert">Course attached created!</div>
        <div class="row">
          <div class="col-md-offset-3 col-md-6">
            <div class="form-group">
              <label for="url">Git repository link</label>
              <input name="url" class="form-control" id="url" placeholder="Enter link to git repository where you story your course">
            </div>
            <button type="submit" class="btn btn-default pull-right">Submit</button>
          </div>
        </div>
      </form>
    </template>
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
        currentView: null,
        files: [],
        createSuccess: null,
        createError: null,
        activeTabs: {
          create: true,
          attach: false
        },
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
      handleNavToggle(e) {
        e.preventDefault();
        let newActiveTabName;
        if (e.target.tagName === 'LI') {
          newActiveTabName = e.target.dataset.type;
        }
        if (e.target.tagName === 'A') {
          newActiveTabName = e.target.parentElement.dataset.type;
        }
        if (!newActiveTabName) return;
        
        for (let tabName in this.activeTabs) {
          if (tabName !== newActiveTabName) {
            this.activeTabs[tabName] = false;
          } else {
            this.activeTabs[tabName] = true;
          }
        }
        
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
      submitCourse(form) {
        this.resetFormStyles();
        const meta = {
          title: form.title.value,
          description: form.description.value,
          service: form.service.value,
          filesOrder: this.files.map(file => file.name),
          author: Object.assign({}, {
            id: this.model.id,
            username: this.model.username,
            bitbucketId: this.model.bitbucketId,
            githubId: this.model.githubId
          })
        };
        
        const req = request
          .post('/api/local/course')
          .field('meta', JSON.stringify(meta));
          
        for (let i = 0; i < form.files.files.length; ++i) {
          const file = form.files.files[i];
          req.attach(file.file, file);
        }
        
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
