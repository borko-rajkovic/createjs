import Vue from 'vue'

function setLastUpdate (state, id) {
  console.log('id: ' + id)
  let _values = id.split('-')
  if (_values.length > 1) {
    let _prefix = _values[0] + '-' + _values[1] + '-'
    state.lastUpdate[_prefix] = true
  }
}

export const removeLastUpdate = (state, questionPrefix) => {
  delete state.lastUpdate[questionPrefix]
}

export const reset = (state) => {
  state.responses = {}
  state.blockAllCorrect = {}
  state.results = {}
  state.noOfUserRetry = {}
  state.waitingForRetry = {}
  state.waitingForNext = {}
  state.waitingForHint = {}
  state.currentLayoutBlockKey = {}
  state.currentLayoutHint = {}
  state.currentLayoutBlockOrder = {}
  state.currentLayoutBlockStatus = {}
  state.blockHints = {}
  state.correctAnswerByHints = {}
  state.objectDatas = {}
  state.radioButtonBlocks = {}
  state.radioButtonAnswered = {}
}

export const setUserResponse = (state, value) => {
  Object.keys(value).forEach(function(key) {
    Object.keys(value[key]).forEach(function(pKey) {
      state[key][pKey] = value[key][pKey]
    })
  })
}

export const resetRadioButtonBlocks = (state) => {
  state.radioButtonBlocks = {}
}

export const resetRadioButtonAnswered = (state) => {
  state.radioButtonAnswered = {}
}

export const setRadioButtonBlocks = (state, id) => {
  console.log('setRadioButtonBlocks')
  setLastUpdate(state, id)
  Vue.set(state.radioButtonBlocks, id, true)
}

export const setRadioButtonAnswered = (state, id) => {
  console.log('setRadioButtonAnswered')
  setLastUpdate(state, id)
  Vue.set(state.radioButtonAnswered, id, true)
}

export const setDisableSubmit = (state, value) => {
  state.disableSubmit = value
}

export const setObjectData = (state, { id, value }) => {
  // console.log('setObjectData')
  // setLastUpdate(state, id)
  Vue.set(state.objectDatas, id, value)
}

export const setCorrectAnswerByHint = (state, id) => {
  console.log('setCorrectAnswerByHint')
  setLastUpdate(state, id)
  Vue.set(state.correctAnswerByHints, id, true)
}

export const setHintBlocks = (state, { id, value }) => {
  console.log('setHintBlocks')
  setLastUpdate(state, id)
  Vue.set(state.blockHints, id, value)
}

export const resetHintBlocks = (state) => {
  state.blockHints = {}
}

export const setCurrentLayoutBlockStatus = (state, { id, value}) => {
  console.log('setCurrentLayoutBlockStatus')
  setLastUpdate(state, id)
  Vue.set(state.currentLayoutBlockStatus, id, value)
}

export const setCurrentLayoutBlockSetCorrect = (state, { id, value }) => {
  console.log('setCurrentLayoutBlockSetCorrect')
  setLastUpdate(state, id)
  Vue.set(state.currentLayoutBlockSetCorrect, id, value)
}

export const setCurrentLayoutBlockOrder = (state, { resultId, id, value }) => {
  console.log('setCurrentLayoutBlockOrder')
  setLastUpdate(state, resultId)
  Vue.set(state.currentLayoutBlockOrder, id, value)
}

export const setCurrentLayoutHint = (state, { id, value }) => {
  console.log('setCurrentLayoutHint')
  setLastUpdate(state, id)
  Vue.set(state.currentLayoutHint, id, value)
}

export const setCurrentLayoutBlockKey = (state, { id, blockkey }) => {
  console.log('setCurrentLayoutBlockKey')
  setLastUpdate(state, id)
  Vue.set(state.currentLayoutBlockKey, id, blockkey)
}

export const setWaitingForNext = (state, { id, value}) => {
  console.log('setWaitingForNext')
  setLastUpdate(state, id)
  Vue.set(state.waitingForNext, id, value)
}

export const setWaitingForHint = (state, { id, value}) => {
  console.log('setWaitingForHint')
  setLastUpdate(state, id)
  Vue.set(state.waitingForHint, id, value)
}

export const setWaitingForRetry = (state, { id, value}) => {
  console.log('setWaitingForRetry')
  setLastUpdate(state, id)
  Vue.set(state.waitingForRetry, id, value)
}

export const setNoOfUserRetry = (state, { id, noOfUserRetry }) => {
  console.log('setNoOfUserRetry')
  setLastUpdate(state, id)
  Vue.set(state.noOfUserRetry, id, noOfUserRetry)
}

export const setResponse = (state, { id, value }) => {
  console.log('setResponse: ' + id)
  setLastUpdate(state, id)
  Vue.set(state.responses, id, value)
}

export const setCurrentPaperId = (state, currentPaperId) => {
  state.currentPaperId = currentPaperId
}

export const setCurrentQuestionIndex = (state, currentQuestionIndex) => {
  state.currentQuestionIndex = currentQuestionIndex
}

export const setShowQuestionNumber = (state, showQuestionNumber) => {
  state.showQuestionNumber = showQuestionNumber
}

export const setNoOfQuestion = (state, noOfQuestion) => {
  state.noOfQuestion = noOfQuestion
}

export const setAllAnswered = (state, allAnswered) => {
  state.allAnswered = allAnswered
}

export const setBlockAllCorrect = (state, { blockId, value }) => {
  console.log('setBlockAllCorrect')
  setLastUpdate(state, blockId)
  Vue.set(state.blockAllCorrect, blockId, value)
}

export const setAllCorrect = (state, allCorrect) => {
  state.allCorrect = allCorrect
}

export const resetBlockAllCorrect = (state, blockId) => {
  // setLastUpdate(state, blockId)
  Vue.delete(state.blockAllCorrect, blockId)
}

export const resetResult = (state, id) => {
  // setLastUpdate(state, id)
  Vue.delete(state.results, id)
}

export const setCompleted = (state, questionIndex) => {
  Vue.set(state.completed, questionIndex, true)
}

export const setResult = (state, { id, correct }) => {
  console.log('setResult')
  setLastUpdate(state, id)
  Vue.set(state.results, id, correct)
}
