export default {
  lastUpdate: {},
  responses: {},
  currentPaperId: '',
  currentQuestionIndex: '',
  noOfQuestion: 0,
  showQuestionNumber: false,
  allAnswered: true,
  allCorrect: true,
  blockAllCorrect: {}, // store the block result
  results: {},
  noOfUserRetry: {}, // { id, noOfUserRetry }
  waitingForRetry: {},
  waitingForNext: {},
  waitingForHint: {},
  currentLayoutBlockKey: {}, // current block key
  currentLayoutHint: {}, // store whether hint shown
  currentLayoutBlockOrder: {}, // store the block order
  // currentLayoutBlockSetCorrect: {}, // store the block result
  currentLayoutBlockStatus: {}, // store the status of block
  blockHints: {}, // store the hint should be shown with resultId
  correctAnswerByHints: {}, // store correct answer set by hint
  objectDatas: {}, // store the object data of component
  disableSubmit: false,

  radioButtonBlocks: {},
  radioButtonAnswered: {},
  completed: {}
}