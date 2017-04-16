<template>
  <div id="js-programming">
    <div class="row cont">
      <div class="col-md-6 col-xs-6 left">
        <div class="panel panel-default with-nav-tabs">
          <div class="panel-heading">
            <ul v-on:click="handleNavToggle" class="nav nav-tabs">
              <li v-bind:class="{ active: activeTabs.html }" role="presentation" data-type="html"><a href="#">HTML</a></li>
              <li v-bind:class="{ active: activeTabs.css }" role="presentation" data-type="css"><a href="#">CSS</a></li>
              <li v-bind:class="{ active: activeTabs.js }" role="presentation" data-type="js"><a href="#">JS</a></li>
            </ul>
          </div>
          <div class="panel-body panel-code">
            <div v-bind:class="{ active: activeTabs.html }" class="editor ace_editor ace-tm" id="editor-html"></div>
            <div v-bind:class="{ active: activeTabs.css }" class="editor ace_editor ace-tm" id="editor-css"></div>
            <div v-bind:class="{ active: activeTabs.js }" class="editor ace_editor ace-tm" id="editor-js"></div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-xs-6 right">
        <div class="panel panel-default panel-log">
          <div class="panel-body iframe-container">
            <iframe src="javascript:''" frameborder="yes">
            </iframe>
          </div>
          <div class="panel-footer">
            <div class="task-goals">
              <ol class="task-goals-list">
              </ol>
            </div>
            <a v-on:click.prevent="openDialog()" class="btn btn-default btn-theory" href="#" role="button">Theory</a>
            <a v-on:click.prevent="checkGoals" v-bind:class="{disabled: autocheck}" class="btn btn-default btn-check" href="#" role="button">Check</a>
            <label class="checkbox-inline">
              <input v-on:click="autocheck = $event.target.checked" type="checkbox" id="auto-check"> autocheck
            </label>
            <a class="pull-right btn btn-default btn-next" href="#" role="button">Next</a>
            <a v-on:click.prevent="showGoalsList" class="pull-right btn btn-default btn-check" href="#" role="button">{{goalsDisplayed ? 'Show goals' : 'Hide goals'}}</a>
          </div>
        </div>
      </div>
    </div>
    <!--<img id="qwe" v-bind:src="require('assets/1-es6Course/2-programOnJs/images/logo.png')">-->
  </div>
</template>

<script>
/* global ace */
  import * as brace from 'brace';
  import 'brace/mode/javascript';
  import 'brace/mode/css';
  import 'brace/mode/html';
  import 'brace/theme/textmate';

  export default {
    name: 'htmlCssJs',
    data() {
      return {
        autocheck: false,
        activeTabs: {
          html: false,
          css: false,
          js: true
        },
        goalsDisplayed: true
        // htmlActive: false,
        // jsActive: true,
        // cssActive: false
      }
    },
    mounted() {
      this.task = this.$parent.task;
      this.course = this.$parent.course;
      this.openDialog();
      // Загружка файлов из courses_rep/course_number/files
      // let scr = document.createElement('script');
      // scr.textContent = 'window.test = "KEK"'
      // let jsp = document.querySelector('#js-programming');
      // jsp.appendChild(scr)
      console.log(this.task)
      console.log(this.course)
      this.iframe = document.querySelector('iframe');
      this.doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
      
      this.doc.body.setAttribute("style", "margin: 0;");
      
      this.styleFrameElement = null;
      this.scriptFrameElement = null;
      this.htmlFrameElement = this.doc.body;
      
      this.initializeEditors();
      this.initializeIframe(() => {
        this.linkEditorsToIframe();
      });
      
      this.loadCheckerScript(this.task.checker);
      this.taskList = document.querySelector('.task-goals-list');
      this.initializeGoalsList(this.task.goals, this.taskList);
    },
    methods: {
      initializeEditors() {
        this.editorHTML = ace.edit('editor-html');
        this.editorHTML.setTheme("ace/theme/textmate");
        this.editorHTML.getSession().setMode('ace/mode/html');
        
        this.editorCSS = ace.edit('editor-css');
        this.editorCSS.setTheme("ace/theme/textmate");
        this.editorCSS.getSession().setMode('ace/mode/css');
        
        this.editorJS = ace.edit('editor-js');
        this.editorJS.setTheme("ace/theme/textmate");
        this.editorJS.getSession().setMode('ace/mode/javascript');
        
        this.editorCSS.insert(this.task.initial.css);
        this.editorHTML.insert(this.task.initial.html);
        this.editorJS.insert(this.task.initial.js);
      },
      linkEditorsToIframe() {
        this.styleFrameElement = this.doc.createElement('style');
        this.styleFrameElement.setAttribute('id', 'user-style');
        this.doc.head.appendChild(this.styleFrameElement);
        this.loadUserCSS();
        
        this.loadUserHTML();
        
        this.loadUserScript();
        
        this.editorHTML.getSession().on('change', (e) => {
          if (this.timeoutHTML) clearTimeout(this.timeoutHTML);
          this.timeoutHTML = setTimeout(() => {
            this.loadUserHTML();
            this.loadUserScript();
          }, 1000);
        });
        
        this.editorJS.getSession().on('change', (e) => {
          if (this.timeoutJS) clearTimeout(this.timeoutJS);
          this.timeoutJS = setTimeout(() => {
            this.loadUserHTML();
            this.loadUserScript();
          }, 1000);
        });
        
        this.editorCSS.getSession().on('change', (e) => {
          if (this.timeoutCSS) clearTimeout(this.timeoutCSS);
          this.timeoutCSS = setTimeout(() => {
            this.loadUserCSS();
          }, 1000);
        });
      },
      loadUserScript() {
        if (this.scriptFrameElement) {
          console.log(this.scriptFrameElement)
          this.scriptFrameElement.parentElement.removeChild(this.scriptFrameElement);
        }
        this.scriptFrameElement = this.doc.createElement('script');
        this.scriptFrameElement.innerHTML = this.editorJS.getValue();
        this.scriptFrameElement.setAttribute('id', 'user-script');
        this.doc.head.appendChild(this.scriptFrameElement);
      },
      loadUserHTML() {
        this.htmlFrameElement.innerHTML = this.editorHTML.getValue();
      },
      loadUserCSS() {
        this.styleFrameElement.innerHTML = this.editorCSS.getValue();
      },
      initializeIframe(callback) {
        let filesDirName = this.course.filesDirName;
        let extRE = /(?:\.([^.]+))?$/;
        let scriptUrls = [];
        for (let fileName of this.course.filesOrder) {
          switch (extRE.exec(fileName)[1]) {
            case 'js':
              let url = filesDirName + '/' + fileName;
              scriptUrls.push(url);
              break;
            case 'css':
              let link = this.doc.createElement('link');
              link.rel = 'stylesheet';
              link.href = filesDirName + '/' + fileName;
              this.doc.head.appendChild(link);
              break;
          }
        }
        this.createAndLoadScript(scriptUrls, callback);
      },
      /**
       * Загрузить скрипты по урлам в правильном порядке
       */
      createAndLoadScript(urls, callback) {
        let url = urls.shift();
        console.log('test')
        let script = this.doc.createElement('script');
        script.src = url;
        script.onload = () => {
          console.log(script)
          if (urls.length) {
            this.createAndLoadScript(urls, callback)
          } else callback();
        }
        this.doc.head.appendChild(script);
      },
      loadCheckerScript(checkerJS) {
        let script = this.doc.createElement('script');
        script.setAttribute('id', 'checker');
        script.innerHTML = checkerJS;
        this.doc.head.appendChild(script);
      },
      checkGoals() {
        let goalKeys = Array.from(this.taskList.querySelectorAll('.task-goal')).map(el => {
          return el.getAttribute('id');
        })
        for (let key of goalKeys) {
          console.log(key)
          let completed = this.iframe.contentWindow.checker[key]();
          completed && document.querySelector(`#${key}`).classList.add('task-goal-completed');
        }
      },
      showGoalsList() {
        let taskGoals = document.querySelector('.task-goals');
        if (taskGoals.style.display === 'block' || taskGoals.style.display === '') {
          taskGoals.style.display = 'none';
          this.goalsDisplayed = false;
        } else {
          taskGoals.style.display = 'block';
          this.goalsDisplayed = true;
        }
      },
      initializeGoalsList(goalsHTML, taskList) {
        taskList.innerHTML = goalsHTML;
      },
      openDialog() {
        this.$parent.openDialog({
          title: this.task.title,
          body: this.task.theory
        });
      },
      handleNavToggle(e) {
        e.preventDefault();
        let editorType;
        if (e.target.tagName === 'LI') {
          editorType = e.target.dataset.type;
        }
        else if (e.target.tagName === 'A') {
          editorType = e.target.parentElement.dataset.type;
        }
        else return;
        for (let tabName in this.activeTabs) {
          if (tabName !== editorType) {
            this.activeTabs[tabName] = false;
          } else {
            this.activeTabs[tabName] = true;
          }
        }
      }
    },
    beforeDestroy() {
      if (this.$parent.dialog) this.$parent.dialog.close();
    }
  }
</script>
<style scoped>
  .panel-code {
    position: relative;
  }
  .editor {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 3px;
  }
  .editor.active {
    z-index: 999;
  }
  .iframe-container {
    padding: 0;
  }
  
</style>
