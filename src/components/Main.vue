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
    mounted() {
      request.get(`/api/local/course/${this.$route.params.courseNumber}/task/${this.$route.params.taskNumber}`).then((res) => {
        this.task = res.body;
        this.task.theory = this.constructHtmlCss(this.task.theory);
        switch (this.task.meta.type) {
          case 'jsProgramming':
            this.currentView = 'jsProgramming';
            break;
        }
      }).catch((err) => {
        console.error(err)
      })

//      this.editor = ace.edit('editor');
//      this.editor.setTheme("ace/theme/textmate");
//      this.editor.getSession().setMode('ace/mode/javascript');

    },
    methods: {
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
      },
      constructHtmlCss(htmlText) {
        let doc = window.document;
        let template = doc.createElement('template');
        let div = doc.createElement('div');
        div.innerHTML = htmlText;
        console.log(div)
        template.appendChild(div);
        let images = Array.from(template.querySelectorAll('img'));
        for (const i in images) {
          let img = images[i];
          let src = img.attributes.src.value;
          src = this.resolveImgUrl(src);
          img.attributes.src.value = src;
        }
        return div.innerHTML;
      },
      resolveImgUrl(relativePath) {
        let req = require.context("assets/", true, /\.(png|jpe?g|gif|svg)(\?.*)?$/);
        console.log("est")
        return req('.' + path.join(`/${this.task.courseDirName}/${this.task.taskDirName}/`, relativePath));
      }
    },
    beforeDestroy() {
      if (this.dialog) this.dialog.close();
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
