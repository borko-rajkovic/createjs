import { mapState } from 'vuex'
import MathFunction from '../mathFunction'
import Geometry from '../geometry'
export default {
  data () {
    return {
      maxCounter: 30
    }
  },
  computed: {
    blockId () {
      if (typeof this.blockkey !== 'undefined') {
        return this.questionPrefix + this.blockkey
      }
      else {
        return this.questionPrefix
      }
    },
    questionPrefix () {
      if (this.contentMode === 'do') {
        if (this.currentPaperId !== '' && this.currentQuestionIndex !== '') {
          return this.currentPaperId + '-' + this.currentQuestionIndex + '-'
        }
      }
      return ''
    },
    geoBoardDraggable () {
      console.log('valueSetting.js - geoBoardDraggable')
      if (this.contentMode === 'do' || (this.stage && this.stage === 'contentSelection')) {
        return true
      }
      else {
        return false
      }
    },
    subContentId () {
      if (this.currentEditor !== 'main') {
        if (this.currentRepeatableBlock && this.currentRepeatableBlock !== '') {
          return this.currentRepeatableBlock.id
        }
      }
      return ''
    },
    getValueSettings () {
      if (typeof this.blockkey === 'undefined' || this.blockkey === '') {
        return this.valueSettings
      }
      else {
        if (this.localValueSettings[this.blockkey]) {
          return this.localValueSettings[this.blockkey]
        }
      }
      return {}
    },
    currentBlockPrefix () {

    },
    ...mapState({
      currentEditor: state => state.currentEditor,
      currentRepeatableBlock: state => state.currentRepeatableBlock,
      subEditorContents: state => state.subEditorContents,
      answers: state => state.composer.answers,
      multiAnswers: state => state.composer.multiAnswers,
      variables: state => state.composer.variables,
      questionVariables: state => state.composer.questionVariables,
      repeatableIndexes: state => state.composer.repeatableIndexes,
      valueSettings: state => state.composer.valueSettings,
      resultBlocks: state => state.composer.resultBlocks,
      dropDownBlocks: state => state.composer.dropDownBlocks,
      optionBlocks: state => state.composer.optionBlocks, 
      radioButtonBlocks: state => state.composer.radioButtonBlocks,
      geoBoards: state => state.composer.geoBoards,
      stackingMultiplications: state => state.composer.stackingMultiplications,
      stackingDivisions: state => state.composer.stackingDivisions,
      localQuestionVariables: state => state.composer.localQuestionVariables,
      localVariables: state => state.composer.localVariables,
      localAnswers: state => state.composer.localAnswers,
      localGeoBoards: state => state.composer.localGeoBoards,
      localValueSettings: state => state.composer.localValueSettings,
      localGeoBoards: state => state.composer.localGeoBoards,
      subEditorRenderedContents: state => state.composer.subEditorRenderedContents,
      contentMode: state => state.composer.contentMode,
      responses: state => state.response.responses,
      currentPaperId: state => state.response.currentPaperId,
      currentQuestionIndex: state => state.response.currentQuestionIndex,
      objectDatas: state => state.response.objectDatas
    })
  },
  methods: {
    geoBoardProperties (id) {
      let _valueSetting = this.getValueSettings
      if (_valueSetting[id]) {
        return _valueSetting[id]
      }
      else {
        return {}
      }
    },
    geoBoardPolygon (id) {
      let _id = id
      if (this.contentMode === 'do') {
        let _geoBoardContentId = this.questionPrefix
        if (this.blockkey) {
          _geoBoardContentId = _geoBoardContentId + this.blockkey + '-'
        }
        _geoBoardContentId = _geoBoardContentId + id
        if (typeof this.objectDatas[_geoBoardContentId] !== 'undefined') {
          return this.objectDatas[_geoBoardContentId]
        }
      }
      if (this.responses && typeof this.responses[id] !== 'undefined') {
        return this.responses[id]
      }
      else {
        let _valueSetting = this.getValueSettings
        if (_valueSetting[id] && _valueSetting[id]['polygon']) {
          return _valueSetting[id]['polygon']
        }
        else {
          return []
        }
      }
    },
    repeatableBlockTemplate (repeatableblockid) {
      if (this.subEditorRenderedContents && this.subEditorRenderedContents[repeatableblockid]) {
        return this.subEditorRenderedContents[repeatableblockid]
      }
      else {
        return '<div></div>'
      }
    },
    noOfRepeatableBlock (repeatableblockid) {
      let _number = this.evalValueSetting(repeatableblockid + '-number')
      if (_number === '') {
        return 0
      }
      else {
        return parseInt(_number)
      }
    },
    evalRepeatableIndex (repeatableBlockId, repeatableIndexId) {
      let _valueSettings = this.getValueSettings
      let _values = []
      if (_valueSettings[repeatableBlockId + '-number']) {
        let _number = this.evalValueSetting(repeatableBlockId + '-number')
        if (_number !== '') {
          for (let i = 0; i < _number; i++) {
            _values.push(this.evalValueSetting(repeatableIndexId, 0, {index: i + 1}))
          }
        }
        return _values
      }
      else {
        return ''
      }
    },
    getRepeatableIndexStr (repeatableBlockId, repeatableIndexId) {
      let _values = this.evalRepeatableIndex(repeatableBlockId, repeatableIndexId)
      if (_values === '') {
        return ''
      }
      else {
        return _values.join(', ')
      }
    },
    getValueSettingType (id) {
      for (let i = 0; i < this.variables.length; i++) {
        if (this.variables[i].id === id) {
          return 'variable'
        }
      }
      for (let i = 0; i < this.answers.length; i++) {
        if (this.answers[i].id === id) {
          return 'answer'
        }
      }
      for (let i = 0; i < this.multiAnswers.length; i++) {
        if (this.multiAnswers[i].id + '-value' === id) {
          return 'multiAnswer'
        }
      }
      for (let i = 0; i < this.repeatableIndexes.length; i++) {
        if (this.repeatableIndexes[i].id === id) {
          return 'repeatableIndex'
        }
      }
      for (let i = 0; i < this.geoBoards.length; i++) {
        if (this.geoBoards[i].id === id) {
          return 'geoBoard'
        }
      }
      for (let i = 0; i < this.resultBlocks.length; i++) {
        if (this.resultBlocks[i].id + '-ref' === id) {
          return 'resultBlock'
        }
      }
      for (let i = 0; i < this.optionBlocks.length; i++) {
        if (this.optionBlocks[i].id + '-options' === id) {
          return 'optionBlock'
        }
      }
      for (let i = 0; i < this.dropDownBlocks.length; i++) {
        if (this.dropDownBlocks[i].id + '-options' === id) {
          return 'dropDownBlock'
        }
      }
      for (let i = 0; i < this.radioButtonBlocks.length; i++) {
        if (this.radioButtonBlocks[i].id + '-value' === id) {
          return 'radioButtonBlock'
        }
      }
      for (let i = 0; i < this.stackingMultiplications.length; i++) {
        if (this.stackingMultiplications[i].id + '-number1' === id) {
          return 'stackingMultiplication'
        }
      }
      for (let i = 0; i < this.stackingDivisions.length; i++) {
        if (this.stackingDivisions[i].id + '-number1' === id) {
          return 'stackingDivision'
        }
      }
      console.log(id + ' not found')
      return ''
    },
    getMultiAnswerStr (id) {
      let _values = this.getMultiAnswer(id)
      if (_values === '') {
        return _values
      }
      else {
        return _values.join(', ')
      }
    },
    getMultiAnswer (id) {
      let _values = []
      let _noOfAnswer = this.noOfAnswer(id)
      if (_noOfAnswer !== '') {
        for (let i = 0; i < _noOfAnswer; i++) {
          let _value = this.evalValueSetting(id + '-value', 0, {index: i + 1})
          if (_value === '') {
            return ''
          }
          else {
            _values.push(_value)
          }
        }
      }
      return _values
    },
    noOfAnswer (id) {
      return this.evalValueSetting(id + '-number', 0)
    },
    // whether valueSetting with id set or not
    valueSettingSet (id) {
      if (typeof this.valueSettings[id] !== 'undefined') {
        return true
      }
      else {
        return false
      }
    },
    handleValueArray (values) {
      if (values.length === 0) {
        return ''
      }
      else if (values.length === 1) {
        return values[0]
      }
      else {
        // if there is any empty value in the array, return empty string
        for (let i = 0; i < values.length; i++) {
          if (values[i] === '') {
            return ''
          }
        }
        try {
          return eval(values.join(''))
        }
        catch (err) {
          console.log('eval error')
          // console.log(err)
          return ''
        }
      }
    },
    evalRepeatableBlock (id) {
      if (this.subEditorRenderedContents[id]) {
        return this.subEditorRenderedContents[id]
      }
      return ''
    },
    // evaluate valueSetting, count for prevent infinity loop
    evalValueSetting (id, count, extra) {
      // assume question variable is value
      let _values = []
      // if (typeof this.valueSettings[id] !== 'undefined') {
      let _valueSettings = this.getValueSettings
      if (typeof _valueSettings[id] !== 'undefined') {
        let _valueSetting = _valueSettings[id]
        for (let i = 0; i < _valueSetting.length; i++) {
          _values.push(this.trackValueSetting(id, _valueSetting[i], count+1, extra))
        }
        if (id.indexOf('-options') !== -1) {
          // no need to handle value array if it's option values
          return _values
        }
        else {
          if (typeof extra !== 'undefined' && extra['array']) {
            return _values
          }
          else {
            return this.handleValueArray(_values)
          }
        }
      }
      else {
        return ''
      }
    },
    getQuestionVariableValue (id, count) {
      if (typeof this.blockkey === 'undefined' || this.blockkey === '') {
        for (let _id in this.questionVariables) {
          if (_id === id) {
            return this.questionVariables[_id]['value']
          }
        }
      }
      else {
        let _questionVariables = this.localQuestionVariables[this.blockkey]
        if (typeof _questionVariables !== 'undefined') {
          for (let _id in _questionVariables) {
            if (_id === id) {
              return _questionVariables[_id]['value']
            }
          }
        }
      }
      return ''
    },
    getVariableValue (id, count, extra) {
      if (count > this.maxCounter) {
        return ''
      }
      return this.evalValueSetting(id, count, extra)
    },
    getRepeatableIndex(id, count, extra) {
      if (count > this.maxCounter) {
        return ''
      }
      return this.evalValueSetting(id, count, extra)
    },
    trackValueSetting (id, item, count, extra) {
      if (item.type === 'questionVariable') {
        return this.getQuestionVariableValue(item.id, count)
      }
      else if (item.type === 'variable') {
        return this.getVariableValue(item.id, count, extra)
      }
      else if (item.type === 'operator') {
        return item.operator
      }
      else if (item.type === 'constant') {
        return item.constant
      }
      else if (item.type === 'property') {
        if (item.property === 'index') {
          if (extra) {
            return extra.index
          }
          else {
            return ''
          }
        }
      }
      else if (item.type === 'repeatableIndex') {
        return this.getRepeatableIndex(item.id, count, extra)
      }
      else if (item.type === 'mathFunction') {
        // get all value for math function
        let _valueSettings = this.getValueSettings
        if (_valueSettings[id + '-' + item.id]) {
          let _valueSetting = _valueSettings[id + '-' + item.id]
          let _values = []
          for (let i = 0; i < _valueSetting.length; i++) {
            _values.push(this.trackValueSetting(id, _valueSetting[i], 0))
          }
          let _result = MathFunction.evaluateMathFunctionValue(item.mathFunction, _values)
          return _result
        }
      }
      else if (item.type === 'geoBoard') {
        let _valueSettings = this.getValueSettings
        if (item.field === 'boardScaleUnit' || item.field === 'boardScale') {
          return _valueSettings[item.id][item.field]
        }
        if (item.field === 'boardScaleUnitSquare') {
          return _valueSettings[item.id]['boardScaleUnit'] + '<sup>2</sup>'
        }
        else if (item.field === 'area') {
          return this.area(item.id)
        }
        else if (item.field === 'perimeter') {
          return this.perimeter(item.id)
        }
        else if (item.field === 'shape') {
          return this.shapeType(item.id)
        }
      }
      else {
        return ''
      }
    },
    geoBoardObject (id) {
      let _valueSettings = this.getValueSettings
      if (_valueSettings[id]) {
        let _geoBoardObject = _valueSettings[id]
        if (this.contentMode === 'do') {
          let _geoBoardContentId = this.questionPrefix
          if (this.blockkey) {
            _geoBoardContentId += this.blockkey + '-'
          }
          _geoBoardContentId += id
          if (typeof this.objectDatas[_geoBoardContentId] !== 'undefined') {
            _geoBoardObject['polygon'] = this.objectDatas[_geoBoardContentId]
          }
        }
        /*
        if (this.responses && typeof this.responses[id] !== 'undefined') {
          _geoBoardObject['polygon'] = this.responses[id]
        }
        */
        return _geoBoardObject
      }
      else {
        return {}
      }
    },
    shapeType (id) {
      let _shape = this.shape(id)
      if (_shape.isSquare()) { return 'square' }
      else if (_shape.isRectangle()) { return 'rectangle' }
      else if (_shape.isRhombus()) { return 'rhombus' }
      else if (_shape.isParallelogram()) { return 'parallelogram' }
      else if (_shape.isTrapezoid()) { return 'trapezoid' }
      else { return '' }
    },
    perimeter (id) {
      let _geoBoardObject = this.geoBoardObject(id)
      let _shape = this.shape(id)
      let _perimeter = Math.round(_shape.perimeter() * _geoBoardObject.boardScale * Math.pow(10, _geoBoardObject.decimalPlace)) / Math.pow(10, _geoBoardObject.decimalPlace)
      if (isNaN(_perimeter)) {
        return ''
      }
      else {
        return _perimeter
      }
    },
    area (id) {
      let _geoBoardObject = this.geoBoardObject(id)
      let _shape = this.shape(id)
      let _area = Math.round(_shape.area() * _geoBoardObject.boardScale * _geoBoardObject.boardScale * Math.pow(10, _geoBoardObject.decimalPlace)) / Math.pow(10, _geoBoardObject.decimalPlace)
      if (isNaN(_area)) {
        return ''
      }
      else {
        return _area
      }
    },
    shape (id) {
      return new Geometry.Polygon(
        this.geomPoints(id)
      )
    },
    geomPoints (id) {
      let _geoBoardObject = this.geoBoardObject(id)
      let _geomPoints = []
      for (let i = 0; i < _geoBoardObject.polygon.length; i++) {
        _geomPoints.push(new Geometry.Point(_geoBoardObject.polygon[i].x, _geoBoardObject.polygon[i].y))
      }
      return _geomPoints
    }
  }
}