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
            <iframe name="htmlCssJs" frameborder="yes"></iframe>
          </div>
          <div class="panel-footer">
            <div class="task-goals">
              <ol class="task-goals-list">
              </ol>
            </div>
            <a v-on:click.prevent="openDialog()" class="btn btn-default btn-theory" href="#" role="button">Theory</a>
            <a v-bind:class="{disabled: autocheck}" class="btn btn-default btn-check" href="#" role="button">Check</a>
            <label class="checkbox-inline">
              <input v-on:click="autocheck = $event.target.checked" type="checkbox" id="auto-check"> autocheck
            </label>
            <a class="pull-right btn btn-default btn-next" href="#" role="button">Next</a>
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
        }
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
      this.iframe = document.htmlCssJs;
      
      this.styleFrameElement = null;
      this.scriptFrameElement = null;
      this.htmlFrameElement = this.iframe.body;
      
      this.initializeEditors();
      this.initializeIframe();
      this.linkEditorsToIframe();
      
      
      
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
        let doc = this.iframe.document;
        
        let style = doc.createElement('style');
        style.innerHTML = this.editorCSS.getValue();
        doc.head.appendChild(style);
        
        doc.body.innerHTML = this.editorHTML.getValue();
        
        let script = doc.createElement('script');
        script.innerHTML = this.editorJS.getValue();
        doc.body.appendChild(script);
        
      },
      initializeIframe() {
        let doc = this.iframe.document;
        let filesDirName = this.course.filesDirName;
        let extRE = /(?:\.([^.]+))?$/;
        for (let fileName of this.course.filesOrder) {
          switch (extRE.exec(fileName)[1]) {
            case 'js':
              let script = doc.createElement('script');
              script.src = filesDirName + '/' + fileName;
              script.async = false;
              script.defer = true;
              doc.head.appendChild(script);
              break;
            case 'css':
              let link = doc.createElement('link');
              link.rel = 'stylesheet';
              link.href = filesDirName + '/' + fileName;
              doc.head.appendChild(link);
              break;
          }
        }
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
