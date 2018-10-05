import { mapState } from 'vuex'
export default {
  props: {
    number1: { default: 36 },
    number2: { default: 12 },
    id: { default: '' },
    number1valuesettingid: { default: '' },
    number2valuesettingid: { default: '' },
    blockkey: { default: '' },
    blockindex: { default: '' }
  },
  data () {
    return {
      answerCorrect: null,
      answerWrong: null,
      rowCorrect: {},
      rowWrong: {},
      currentRow: 0,
      rowResult: [],
      rowSubmitted: [],
      readyToShowSubmitBtn: false,
      lastInputBlock: '',
      showHint: false,
      guidedMode: false,
      disableInput: false,
      currentInputBlockPrefix: '',
      nextRow: '',
      nextShowHint: false,
      nextReadyToShowSubmitBtn: false
    }
  },
  computed: {
    objectData () {
      let _objectData = {
        answerCorrect: this.answerCorrect,
        answerWrong: this.answerWrong,
        rowCorrect: this.rowCorrect,
        rowWrong: this.rowWrong,
        currentRow: this.currentRow,
        rowResult: this.rowResult,
        rowSubmitted: this.rowSubmitted,
        readyToShowSubmitBtn: this.readyToShowSubmitBtn,
        lastInputBlock: this.lastInputBlock,
        showHint: this.showHint,
        disableInput: this.disableInput
      }
      if (this.nextRow !== '') {
        _objectData.currentRow = nextRow
      }
      if (this.nextShowHint) {
        _objectData.showHint = true
      }
      if (this.nextReadyToShowSubmitBtn) {
        _objectData.readyToShowSubmitBtn = true
      }
      return _objectData
    },
    allowInput () {
      if (this.disableInput) {
        return false
      }
      else if (this.contentMode === 'preview') {
        return false
      }
      else {
        return true
      }
    },
    control () {
      if (this.contentMode === 'preview' || this.contentMode === 'edit') {
        return false
      }
      else {
        return this.valueSettingGuidedMode
      }
    },
    valueSettingGuidedMode () {
      let _valueSettings = this.getValueSettings
      if (_valueSettings && _valueSettings[this.id] && _valueSettings[this.id]['guidedMode']) {
        return _valueSettings[this.id]['guidedMode']
      }
      else {
        return false
      }
    },
    preview () {
      if (this.contentMode === 'preview') {
        return true
      }
      else {
        return false
      }
    },
    number1Value () {
      if (this.number1valuesettingid !== '') {
        return this.evalValueSetting(this.id + '-number1', 0) 
      }
      else {
        return this.number1
      }
    },
    number2Value () {
      if (this.number2valuesettingid !== '') {
        return this.evalValueSetting(this.id + '-number2', 0)
      }
      else {
        return this.number2
      }
    },
    inputBlockPrefix () {
      if (this.blockkey) {
        return this.questionPrefix + this.blockkey + '-' + this.id + '-'
      }
      else {
        return this.questionPrefix + this.id + '-'
      }
    },
    number1Str () {
      return this.number1Value.toString()
    },
    number1Len () {
      return this.number1Str.length
    },
    number2Str () {
      return this.number2Value.toString()
    },
    number2Len () {
      return this.number2Str.length
    },
    ...mapState({
      contentFontSize: state => state.composer.contentFontSize,
      contentMode: state => state.composer.contentMode,
      responses: state => state.response.responses,
      currentPaperId: state => state.response.currentPaperId,
      currentQuestionIndex: state => state.response.currentQuestionIndex,
      contentSelection: state => state.composer.contentSelection,
      valueSettings: state => state.composer.valueSettings,
      responses: state => state.response.responses,
      currentLayoutBlockStatus: state => state.response.currentLayoutBlockStatus,
      objectDatas: state => state.response.objectDatas,
      blockAllCorrect: state => state.response.blockAllCorrect
    })
  },
  methods: {
    pad (n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },
    userInputValue (stepIndex, index) {
      let _id = this.inputBlockId(stepIndex, index)
      if (typeof this.responses[_id] !== 'undefined') {
        return this.responses[_id]
      }
    },
    inputBlockId (stepIndex, index) {
      return this.inputBlockPrefix  + stepIndex + '-' + index
    },
    updateGuidedMode (value) {
      let _valueSettings = {}
      if (this.valueSettings) {
        _valueSettings = this.valueSettings
      }
      _valueSettings[this.id] = _valueSettings[this.id] || {}
      _valueSettings[this.id]['guidedMode'] = value
      this.$store.commit('composer/setValueSettings', _valueSettings)
    },
    loadObjectData () {
      if (this.objectDatas && typeof this.objectDatas[this.inputBlockPrefix] !== 'undefined') {
        let _objectData = this.objectDatas[this.inputBlockPrefix]
        this.currentRow = _objectData.currentRow,
        this.rowResult = _objectData.rowResult,
        this.rowSubmitted = _objectData.rowSubmitted,
        this.readyToShowSubmitBtn = _objectData.readyToShowSubmitBtn,
        this.lastInputBlock = _objectData.lastInputBlock,
        this.showHint = _objectData.showHint,
        this.disableInput = _objectData.disableInput
      }
    },
    takeoverControl () {
      if (typeof this.blockAllCorrect[this.blockId] === 'undefined') {
        if (this.contentMode === 'do') {
          if (this.valueSettingGuidedMode) {
            this.$store.commit('response/setDisableSubmit', true)
          }
          else {
            this.$store.commit('response/setDisableSubmit', false)
          }
        }
        else {
          this.$store.commit('response/setDisableSubmit', false)
        }
      }
    },
    releaseControl () {
      if (this.valueSettingGuidedMode) {
        this.$store.commit('response/setDisableSubmit', false)
      }
    }
  }
}