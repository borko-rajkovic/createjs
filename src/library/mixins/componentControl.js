import { mapState } from 'vuex'
export default {
  computed: {
    allowGeoBoardVertexUpdate () {
      if (this.contentMode === 'do') {
        return true
      }
      else if (this.contentMode === 'edit') {
        return true
      }
      else if (this.contentMode === 'preview') {
        if (this.contentSelection) {
          return true
        }
      }
      return false
    },
    editMode () {
      if (this.contentMode === 'edit') {
        return true
      }
      else if (this.contentSelection) {
        return true
      }
      else {
        return false
      }
    },
    ...mapState({
      contentMode: state => state.composer.contentMode,
      contentSelection: state => state.composer.contentSelection
    })
  }
}