export default {
  questionVariables: {},
  variables: {},
  answers: {},
  multiAnswers: {},
  repeatableBlocks: {},
  repeatableIndexes: {},
  geoBoards: {},
  resultBlocks: {},
  dropDownBlocks: {},
  optionBlocks: {},
  radioButtonBlocks: {},
  stackingMultiplications: {},
  stackingDivisions: {},
  valueSettings: {},
  currentLayoutBlock: null,
  contentMode: '', // edit, preview, do
  contentType: '', // contentBlock, compositeContent
  contentSelection: false, // show component properties if contentSelection is true

  layoutBlockStructure: {},
  layoutBlockContent: {},
  layoutBlockHint: {},
  layoutBlockFlow: {},
  layoutBlockOrder: {},
  layoutBlockPreview: {},
  layoutBlockPreviewControl: {},
  layoutBlockTitle: '',

  localQuestionVariables: {},
  localVariables: {},
  localValueSettings: {},
  localAnswers: {},
  localGeoBoards: {},
  localRepeatableBlocks: {},
  currentRepeatableBlock: '',
  currentEditor: 'main', // main, repeatable

  mainEditorRenderedContent: '',
  subEditorContents: {},
  subEditorRenderedContents: {},
  preloadRepeatableBlocks: [], // repeatable blocks for rendering
  currentStage: '', // loadingSubEditorContent, 'readyToEdit'

  contentFontSize: '1.2em',

  backPath: '',
  selectedCategories: [],
  searchCategories: [],
  currentContent: {},

  recordPerPage: 10
}
