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
  import bootstrapDialog from 'bootstrap3-dialog'
  import path from 'path';

  // "type": "htmlCssJs/jsProgramming/question/radio/answers"
  export default {
    components: {
      jsProgramming
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
</style>
