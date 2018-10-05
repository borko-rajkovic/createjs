<template>
  <paper-viewer :doPaper="true"></paper-viewer>
</template>

<script>
import PaperViewer from '../composer/paperViewer'
export default {
  name: 'do-paper',
  components: {
    PaperViewer
  },
  computed: {
    paperId () {
      return this.$route.params.id
    }
  },
  mounted () {
    this.$store.commit('composer/setBackPath', '/do-paper-list')
  },
  beforeDestroy () {
    this.$store.commit('composer/setBackPath', '')
  }
}
</script>
