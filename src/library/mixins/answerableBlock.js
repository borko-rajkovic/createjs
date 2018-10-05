export default {
  computed: {
    inputBlockId () {
      if (this.blockindex) {
        return this.blockId + this.id + '-' + this.blockindex
      }
      else {
        return this.blockId + this.id
      }
    }
  },
  methods: {
    showResult (blockkey) {
      if (blockkey === '' || blockkey === this.blockkey) {
        if (this.isCorrect()) {
          this.correct = true
        }
        else {
          this.wrong = true
        }
      }
    },
    resetBlockResult (blockkey) {
      if (blockkey === '' || blockkey === this.blockkey) {
        this.correct = null
        this.wrong = null
      }
    },
    disableUserInput (blockkey) {
      if (blockkey === '' || blockkey === this.blockkey) {
        this.disableInput = true
      }
    },
    enableUserInput (blockkey) {
      if (blockkey === '' || blockkey === this.blockkey) {
        this.disableInput = false
      }
    },
    setAnswerableBlockEvents () {
      this.$root.$on('isAnswered', this.isAnswered)
      this.$root.$on('checkAnswer', this.checkAnswer)
      this.$root.$on('showResult', this.showResult)
      this.$root.$on('resetBlockResult', this.resetBlockResult)
      this.$root.$on('disableUserInput', this.disableUserInput)
      this.$root.$on('enableUserInput', this.enableUserInput)
      this.$root.$on('setCorrectAnswer', this.setCorrectAnswer)
    },
    removeAnswerableBlockEvents () {
      this.$root.$off('isAnswered', this.isAnswered)
      this.$root.$off('checkAnswer', this.checkAnswer)
      this.$root.$off('showResult', this.showResult)
      this.$root.$off('resetBlockResult', this.resetBlockResult)
      this.$root.$off('disableUserInput', this.disableUserInput)
      this.$root.$off('enableUserInput', this.enableUserInput)
      this.$root.$off('setCorrectAnswer', this.setCorrectAnswer)
    }
  }
}