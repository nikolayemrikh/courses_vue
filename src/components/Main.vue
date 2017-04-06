<template>
  <div id="main">
    <!--<js-programming v-if="type == 'jsProgramming'"></js-programming>-->
    <component v-if="currentView" v-bind:is="currentView"></component>
  </div>
</template>

<script>
  //  import * as brace from 'brace';
  //  import 'brace/mode/javascript';
  //  import 'brace/theme/textmate';
  import { mapState } from 'vuex'
  import { mapActions } from 'vuex'
  import { mapMutations } from 'vuex'
  import request from 'superagent'
  import jsProgramming from './JsProgramming'
  import htmlCssJs from './htmlCssJs'
  import bootstrapDialog from 'bootstrap3-dialog'
  import path from 'path';

  // "type": "htmlCssJs/jsProgramming/question/radio/answers"
  export default {
    name: 'main',
    components: {
      jsProgramming,
      htmlCssJs
    },
    data() {
      return {
        currentView: null
      }
    },
    computed: {
      ...mapState('models', [
        'course',
        'task'
      ])
    },
    beforeMount() {
      this.$on('okHead', function() {
        switch (this.task.type) {
          case 'jsProgramming':
            this.currentView = 'jsProgramming';
            break;
          case 'htmlCssJs':
            this.currentView = 'htmlCssJs';
            break;
        }
      })
//      this.task.theory = this.constructHtmlCss(this.task.theory);


//      this.editor = ace.edit('editor');
//      this.editor.setTheme("ace/theme/textmate");
//      this.editor.getSession().setMode('ace/mode/javascript');

    },
    methods: {
      ...mapActions('models', [
        'loadTask'
      ]),
      ...mapMutations('models', [
        'setTask'
      ]),
      openDialog({title, body}) {
        this.dialog = bootstrapDialog.show({
          title: title,
          message: body,
          cssClass: 'dialog-css',
          buttons: [{
            label: 'Close',
            action: function(dialogItself){
              dialogItself.close();
            }
          }],
          nl2br: false
        });
      }
    },
    beforeDestroy() {
      if (this.dialog) this.dialog.close();
    },
    head: {
      base() {
        return [{
          href: `/static/courses/${this.task.courseDirName}/${this.task.taskDirName}/`
        }]
      }
    }
  }
</script>
<style>
  #main {
    position: relative;
  }
  
  .dialog-css .bootstrap-dialog-header {
    font-size: 1.25rem;
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

  #main .panel {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-content: stretch;
  }

  #main .panel-body {
    display: flex;
    flex-grow: 1;
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
  
  .panel.with-nav-tabs .panel-heading{
      padding: 5px 5px 0 5px;
  }
  .panel.with-nav-tabs .nav-tabs{
  	border-bottom: none;
  }
  .panel.with-nav-tabs .nav-justified{
  	margin-bottom: -1px;
  }
  /********************************************************************/
  /*** PANEL DEFAULT ***/
  .with-nav-tabs.panel-default .nav-tabs > li > a,
  .with-nav-tabs.panel-default .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-default .nav-tabs > li > a:focus {
      color: #777;
  }
  .with-nav-tabs.panel-default .nav-tabs > .open > a,
  .with-nav-tabs.panel-default .nav-tabs > .open > a:hover,
  .with-nav-tabs.panel-default .nav-tabs > .open > a:focus,
  .with-nav-tabs.panel-default .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-default .nav-tabs > li > a:focus {
      color: #777;
  	background-color: #ddd;
  	border-color: transparent;
  }
  .with-nav-tabs.panel-default .nav-tabs > li.active > a,
  .with-nav-tabs.panel-default .nav-tabs > li.active > a:hover,
  .with-nav-tabs.panel-default .nav-tabs > li.active > a:focus {
  	color: #555;
  	background-color: #fff;
  	border-color: #ddd;
  	border-bottom-color: transparent;
  }
  .with-nav-tabs.panel-default .nav-tabs > li.dropdown .dropdown-menu {
      background-color: #f5f5f5;
      border-color: #ddd;
  }
  .with-nav-tabs.panel-default .nav-tabs > li.dropdown .dropdown-menu > li > a {
      color: #777;   
  }
  .with-nav-tabs.panel-default .nav-tabs > li.dropdown .dropdown-menu > li > a:hover,
  .with-nav-tabs.panel-default .nav-tabs > li.dropdown .dropdown-menu > li > a:focus {
      background-color: #ddd;
  }
  .with-nav-tabs.panel-default .nav-tabs > li.dropdown .dropdown-menu > .active > a,
  .with-nav-tabs.panel-default .nav-tabs > li.dropdown .dropdown-menu > .active > a:hover,
  .with-nav-tabs.panel-default .nav-tabs > li.dropdown .dropdown-menu > .active > a:focus {
      color: #fff;
      background-color: #555;
  }
  /********************************************************************/
  /*** PANEL PRIMARY ***/
  .with-nav-tabs.panel-primary .nav-tabs > li > a,
  .with-nav-tabs.panel-primary .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-primary .nav-tabs > li > a:focus {
      color: #fff;
  }
  .with-nav-tabs.panel-primary .nav-tabs > .open > a,
  .with-nav-tabs.panel-primary .nav-tabs > .open > a:hover,
  .with-nav-tabs.panel-primary .nav-tabs > .open > a:focus,
  .with-nav-tabs.panel-primary .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-primary .nav-tabs > li > a:focus {
  	color: #fff;
  	background-color: #3071a9;
  	border-color: transparent;
  }
  .with-nav-tabs.panel-primary .nav-tabs > li.active > a,
  .with-nav-tabs.panel-primary .nav-tabs > li.active > a:hover,
  .with-nav-tabs.panel-primary .nav-tabs > li.active > a:focus {
  	color: #428bca;
  	background-color: #fff;
  	border-color: #428bca;
  	border-bottom-color: transparent;
  }
  .with-nav-tabs.panel-primary .nav-tabs > li.dropdown .dropdown-menu {
      background-color: #428bca;
      border-color: #3071a9;
  }
  .with-nav-tabs.panel-primary .nav-tabs > li.dropdown .dropdown-menu > li > a {
      color: #fff;   
  }
  .with-nav-tabs.panel-primary .nav-tabs > li.dropdown .dropdown-menu > li > a:hover,
  .with-nav-tabs.panel-primary .nav-tabs > li.dropdown .dropdown-menu > li > a:focus {
      background-color: #3071a9;
  }
  .with-nav-tabs.panel-primary .nav-tabs > li.dropdown .dropdown-menu > .active > a,
  .with-nav-tabs.panel-primary .nav-tabs > li.dropdown .dropdown-menu > .active > a:hover,
  .with-nav-tabs.panel-primary .nav-tabs > li.dropdown .dropdown-menu > .active > a:focus {
      background-color: #4a9fe9;
  }
  /********************************************************************/
  /*** PANEL SUCCESS ***/
  .with-nav-tabs.panel-success .nav-tabs > li > a,
  .with-nav-tabs.panel-success .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-success .nav-tabs > li > a:focus {
  	color: #3c763d;
  }
  .with-nav-tabs.panel-success .nav-tabs > .open > a,
  .with-nav-tabs.panel-success .nav-tabs > .open > a:hover,
  .with-nav-tabs.panel-success .nav-tabs > .open > a:focus,
  .with-nav-tabs.panel-success .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-success .nav-tabs > li > a:focus {
  	color: #3c763d;
  	background-color: #d6e9c6;
  	border-color: transparent;
  }
  .with-nav-tabs.panel-success .nav-tabs > li.active > a,
  .with-nav-tabs.panel-success .nav-tabs > li.active > a:hover,
  .with-nav-tabs.panel-success .nav-tabs > li.active > a:focus {
  	color: #3c763d;
  	background-color: #fff;
  	border-color: #d6e9c6;
  	border-bottom-color: transparent;
  }
  .with-nav-tabs.panel-success .nav-tabs > li.dropdown .dropdown-menu {
      background-color: #dff0d8;
      border-color: #d6e9c6;
  }
  .with-nav-tabs.panel-success .nav-tabs > li.dropdown .dropdown-menu > li > a {
      color: #3c763d;   
  }
  .with-nav-tabs.panel-success .nav-tabs > li.dropdown .dropdown-menu > li > a:hover,
  .with-nav-tabs.panel-success .nav-tabs > li.dropdown .dropdown-menu > li > a:focus {
      background-color: #d6e9c6;
  }
  .with-nav-tabs.panel-success .nav-tabs > li.dropdown .dropdown-menu > .active > a,
  .with-nav-tabs.panel-success .nav-tabs > li.dropdown .dropdown-menu > .active > a:hover,
  .with-nav-tabs.panel-success .nav-tabs > li.dropdown .dropdown-menu > .active > a:focus {
      color: #fff;
      background-color: #3c763d;
  }
  /********************************************************************/
  /*** PANEL INFO ***/
  .with-nav-tabs.panel-info .nav-tabs > li > a,
  .with-nav-tabs.panel-info .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-info .nav-tabs > li > a:focus {
  	color: #31708f;
  }
  .with-nav-tabs.panel-info .nav-tabs > .open > a,
  .with-nav-tabs.panel-info .nav-tabs > .open > a:hover,
  .with-nav-tabs.panel-info .nav-tabs > .open > a:focus,
  .with-nav-tabs.panel-info .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-info .nav-tabs > li > a:focus {
  	color: #31708f;
  	background-color: #bce8f1;
  	border-color: transparent;
  }
  .with-nav-tabs.panel-info .nav-tabs > li.active > a,
  .with-nav-tabs.panel-info .nav-tabs > li.active > a:hover,
  .with-nav-tabs.panel-info .nav-tabs > li.active > a:focus {
  	color: #31708f;
  	background-color: #fff;
  	border-color: #bce8f1;
  	border-bottom-color: transparent;
  }
  .with-nav-tabs.panel-info .nav-tabs > li.dropdown .dropdown-menu {
      background-color: #d9edf7;
      border-color: #bce8f1;
  }
  .with-nav-tabs.panel-info .nav-tabs > li.dropdown .dropdown-menu > li > a {
      color: #31708f;   
  }
  .with-nav-tabs.panel-info .nav-tabs > li.dropdown .dropdown-menu > li > a:hover,
  .with-nav-tabs.panel-info .nav-tabs > li.dropdown .dropdown-menu > li > a:focus {
      background-color: #bce8f1;
  }
  .with-nav-tabs.panel-info .nav-tabs > li.dropdown .dropdown-menu > .active > a,
  .with-nav-tabs.panel-info .nav-tabs > li.dropdown .dropdown-menu > .active > a:hover,
  .with-nav-tabs.panel-info .nav-tabs > li.dropdown .dropdown-menu > .active > a:focus {
      color: #fff;
      background-color: #31708f;
  }
  /********************************************************************/
  /*** PANEL WARNING ***/
  .with-nav-tabs.panel-warning .nav-tabs > li > a,
  .with-nav-tabs.panel-warning .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-warning .nav-tabs > li > a:focus {
  	color: #8a6d3b;
  }
  .with-nav-tabs.panel-warning .nav-tabs > .open > a,
  .with-nav-tabs.panel-warning .nav-tabs > .open > a:hover,
  .with-nav-tabs.panel-warning .nav-tabs > .open > a:focus,
  .with-nav-tabs.panel-warning .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-warning .nav-tabs > li > a:focus {
  	color: #8a6d3b;
  	background-color: #faebcc;
  	border-color: transparent;
  }
  .with-nav-tabs.panel-warning .nav-tabs > li.active > a,
  .with-nav-tabs.panel-warning .nav-tabs > li.active > a:hover,
  .with-nav-tabs.panel-warning .nav-tabs > li.active > a:focus {
  	color: #8a6d3b;
  	background-color: #fff;
  	border-color: #faebcc;
  	border-bottom-color: transparent;
  }
  .with-nav-tabs.panel-warning .nav-tabs > li.dropdown .dropdown-menu {
      background-color: #fcf8e3;
      border-color: #faebcc;
  }
  .with-nav-tabs.panel-warning .nav-tabs > li.dropdown .dropdown-menu > li > a {
      color: #8a6d3b; 
  }
  .with-nav-tabs.panel-warning .nav-tabs > li.dropdown .dropdown-menu > li > a:hover,
  .with-nav-tabs.panel-warning .nav-tabs > li.dropdown .dropdown-menu > li > a:focus {
      background-color: #faebcc;
  }
  .with-nav-tabs.panel-warning .nav-tabs > li.dropdown .dropdown-menu > .active > a,
  .with-nav-tabs.panel-warning .nav-tabs > li.dropdown .dropdown-menu > .active > a:hover,
  .with-nav-tabs.panel-warning .nav-tabs > li.dropdown .dropdown-menu > .active > a:focus {
      color: #fff;
      background-color: #8a6d3b;
  }
  /********************************************************************/
  /*** PANEL DANGER ***/
  .with-nav-tabs.panel-danger .nav-tabs > li > a,
  .with-nav-tabs.panel-danger .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-danger .nav-tabs > li > a:focus {
  	color: #a94442;
  }
  .with-nav-tabs.panel-danger .nav-tabs > .open > a,
  .with-nav-tabs.panel-danger .nav-tabs > .open > a:hover,
  .with-nav-tabs.panel-danger .nav-tabs > .open > a:focus,
  .with-nav-tabs.panel-danger .nav-tabs > li > a:hover,
  .with-nav-tabs.panel-danger .nav-tabs > li > a:focus {
  	color: #a94442;
  	background-color: #ebccd1;
  	border-color: transparent;
  }
  .with-nav-tabs.panel-danger .nav-tabs > li.active > a,
  .with-nav-tabs.panel-danger .nav-tabs > li.active > a:hover,
  .with-nav-tabs.panel-danger .nav-tabs > li.active > a:focus {
  	color: #a94442;
  	background-color: #fff;
  	border-color: #ebccd1;
  	border-bottom-color: transparent;
  }
  .with-nav-tabs.panel-danger .nav-tabs > li.dropdown .dropdown-menu {
      background-color: #f2dede; /* bg color */
      border-color: #ebccd1; /* border color */
  }
  .with-nav-tabs.panel-danger .nav-tabs > li.dropdown .dropdown-menu > li > a {
      color: #a94442; /* normal text color */  
  }
  .with-nav-tabs.panel-danger .nav-tabs > li.dropdown .dropdown-menu > li > a:hover,
  .with-nav-tabs.panel-danger .nav-tabs > li.dropdown .dropdown-menu > li > a:focus {
      background-color: #ebccd1; /* hover bg color */
  }
  .with-nav-tabs.panel-danger .nav-tabs > li.dropdown .dropdown-menu > .active > a,
  .with-nav-tabs.panel-danger .nav-tabs > li.dropdown .dropdown-menu > .active > a:hover,
  .with-nav-tabs.panel-danger .nav-tabs > li.dropdown .dropdown-menu > .active > a:focus {
      color: #fff; /* active text color */
      background-color: #a94442; /* active bg color */
  }
</style>
