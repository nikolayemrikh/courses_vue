<template>
  <div id="js-programming">
    <div class="row cont">
      <div class="col-md-6 col-xs-6 left">
        <div class="panel panel-default panel-code">
          <div id="editor"></div>
        </div>
      </div>
      <div class="col-md-6 col-xs-6 right">
        <div class="panel panel-default panel-log">
          <div class="panel-body"></div>
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
  import * as brace from 'brace';
  import 'brace/mode/javascript';
  import 'brace/theme/textmate';

  export default {
    name: 'jsProgramming',
    data() {
      return {
        autocheck: false,
      }
    },
    mounted() {
      this.editor = ace.edit('editor');
      this.editor.setTheme("ace/theme/textmate");
      this.editor.getSession().setMode('ace/mode/javascript');

      this.task = this.$parent.task;
      this.openDialog();
      // Загружка файлов из courses_rep/course_number/files
      let scr = document.createElement('script');
      scr.textContent = 'window.test = "KEK"'
      let jsp = document.querySelector('#js-programming');
      jsp.appendChild(scr)
    },
    methods: {
      openDialog() {
        this.$parent.openDialog({
          title: this.task.meta.title,
          body: this.task.theory
        });
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
  #editor {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 3px;
  }
  .cont, .cont > div[class*='col-'] {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    flex: 1 0 auto;
    min-height: 590px;
  }

  .panel {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-content: stretch;
  }

  .panel-body {
    display: flex;
    flex-grow:1;
  }

  .task-goals {
    border: 1px solid rgba(158, 158, 158, 0.4);
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 10px;
    background: white;
  }
  .task-goals-list {
    padding: 0;
    margin: 0;
    list-style: none;
    counter-reset: goal-number;
  }
  .task-goal {
    margin-bottom: 10px;
    font-size: 0.9rem;
  }
  .task-goal::before {
    content: "Goal "counter(goal-number);
    counter-increment: goal-number;
    margin-right: 10px;
    padding: 5px;
    font-family: sans-serif;
    font-size: 12px;
    line-height: 12px;
    border: 1px solid #cccccc;
    border-radius: 3px;
    background-color: white;
  }

</style>
