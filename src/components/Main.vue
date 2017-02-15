<template>
  <div id="main">
    <js-programming v-if="type == 'jsProgramming'"></js-programming>
  </div>
</template>

<script>
//  import * as brace from 'brace';
//  import 'brace/mode/javascript';
//  import 'brace/theme/textmate';
  import request from 'superagent'
  import jsProgramming from './JsProgramming'
  import bootstrapDialog from 'bootstrap3-dialog'

  // "type": "htmlCssJs/jsProgramming/question/radio/answers"
  export default {
    components: {
      jsProgramming
    },
    data() {
      return {
        type: 'jsProgramming'
      }
    },
    mounted() {
      request.get(`/api/local/course/${this.$route.params.courseNumber}/task/${this.$route.params.courseNumber}`).then((res) => {
        this.task = res.body;
        console.log(this.task)
      }).catch((err) => {
        console.error(err)
      })
//      switch (this.type) {
//        case 'jsProgramming':
//
//          break;
//      }

//      this.editor = ace.edit('editor');
//      this.editor.setTheme("ace/theme/textmate");
//      this.editor.getSession().setMode('ace/mode/javascript');

    },
    methods: {
      openDialog(msg) {
        bootstrapDialog.show({
          message: msg,
          buttons: [{
            label: 'Close',
            action: function(dialogItself){
              dialogItself.close();
            }
          }]
        });
      }
    }
  }
</script>
<style scoped>
  #main {
    position: relative;
  }
  #editor {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 740px;
    width: 600px;
  }
</style>
