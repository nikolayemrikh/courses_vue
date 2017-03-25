<template>
  <div id="addCourse">
    <form>
      <input type="text" name=""/>
      <input type="submit" value="Submit"/>
    </form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { mapActions } from 'vuex'
  import { mapMutations } from 'vuex'
  import request from 'superagent'
  import jsProgramming from './JsProgramming'

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
    },
    methods: {
      
    },
    beforeDestroy() {
      
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
