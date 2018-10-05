/*
export const someMutation = (state) => {
}
*/

import Vue from 'vue'

export const setCurrentContent = (state, currentContent) => {
  state.currentContent = currentContent
}

export const setContentType = (state, contentType) => {
  state.contentType = contentType
}

export const setSearchCategories = (state, searchCategories) => {
  state.searchCategories = searchCategories
}

export const setSelectedCategories = (state, selectedCategories) => {
  state.selectedCategories = selectedCategories
}

export const setBackPath = (state, backPath) => {
  state.backPath = backPath
}

export const setContentFontSize = (state, contentFontSize) => {
  state.contentFontSize = contentFontSize
}

export const setMainEditorRenderedContent = (state, mainEditorRenderedContent) => {
  state.mainEditorRenderedContent = mainEditorRenderedContent
}

export const setCurrentStage = (state, currentStage) => {
  state.currentStage = currentStage
}

export const setPreloadRepeatableBlocks = (state, preloadRepeatableBlocks) => {
  state.preloadRepeatableBlocks = preloadRepeatableBlocks
}

export const setSubEditorRenderedContents = (state, subEditorRenderedContents) => {
  state.subEditorRenderedContents = subEditorRenderedContents
}

export const setSubEditorRenderedContent = (state, value) => {
  Vue.set(state.subEditorRenderedContents, value.id, value.subEditorRenderedContent)
  let _str = JSON.stringify(state.subEditorRenderedContents)
  console.log(JSON.parse(_str))
}

export const setSubEditorContents = (state, subEditorContents) => {
  state.subEditorContents = subEditorContents
}

export const setSubEditorContent = (state, value) => {
  Vue.set(state.subEditorContents, value.id, value.subEditorContent)
}

export const setCurrentEditor = (state, currentEditor) => {
  state.currentEditor = currentEditor
}

export const setCurrentRepeatableBlock = (state, currentRepeatableBlock) => {
  state.currentRepeatableBlock = currentRepeatableBlock
}

export const setLocalQuestionVariables = (state, localQuestionVariables) => {
  Vue.set(state, 'localQuestionVariables', localQuestionVariables)
}

export const resetLocalQuestionVariables = (state) => {
  state.localQuestionVariables = {}
}

export const setLocalVariables = (state, localVariables) => {
  Vue.set(state, 'localVariables', localVariables)
}

export const setLocalValueSettings = (state, localValueSettings) => {
  Vue.set(state, 'localValueSettings', localValueSettings)
}

export const resetLocalValueSettings = (state) => {
  state.localValueSettings = {}
}

export const setLocalAnswers = (state, localAnswers) => {
  Vue.set(state, 'localAnswers', localAnswers)
}

export const setLocalGeoBoards = (state, localGeoBoards) => {
  Vue.set(state, 'localGeoBoards', localGeoBoards)
}

export const setLocalValues = (state, localValues) => {
  Vue.set(state, 'localValues', localValues)
}

export const resetLayoutBlock = (state) => {
  state.layoutBlockContent = {}
  state.layoutBlockFlow = {}
  state.layoutBlockHint = {}
  state.layoutBlockOrder = {}
  state.layoutBlockPreview = {}
  state.layoutBlockPreviewControl = {}
  state.layoutBlockStructure = {}
  state.layoutBlockTitle = ''
}

export const setLayoutBlockContent = (state, { blockkey, content }) => {
  Vue.set(state.layoutBlockContent, blockkey, content)
}

export const setLayoutBlockTitle = (state, layoutBlockTitle) => {
  state.layoutBlockTitle = layoutBlockTitle
}

export const setLayoutBlockContents = (state, layoutBlockContents) => {
  Vue.set(state, 'layoutBlockContent', layoutBlockContents)
}

export const addLayoutBlockHint = (state, layoutBlockKey) => {
  Vue.set(state, 'layoutBlockHint', {})
  Vue.set(state.layoutBlockHint, layoutBlockKey, true)
}

export const removeLayoutBlockHint = (state, layoutBlockKey) => {
  Vue.delete(state.layoutBlockHint, layoutBlockKey)
}

export const setLayoutBlockPreview = (state, layoutBlockPreview) => {
  Vue.set(state, 'layoutBlockPreview', layoutBlockPreview)
}

export const setLayoutBlockPreviewControl = (state, layoutBlockPreviewControl) => {
  Vue.set(state, 'layoutBlockPreviewControl', layoutBlockPreviewControl)
}

export const moveLayoutBlockPreviewToNext = (state) => {
  let _currentOrder = state.layoutBlockPreviewControl['currentOrder']
  Vue.set(state.layoutBlockPreviewControl, 'currentOrder', _currentOrder + 1)
}

export const setContentSelection = (state, contentSelection) => {
  state.contentSelection = contentSelection
}

export const setContentMode = (state, contentMode) => {
  state.contentMode = contentMode
}

export const setLayoutBlockOrder = (state, { blockkey, order }) => {
  Vue.set(state.layoutBlockOrder, blockkey, order)
}

export const setLayoutBlockOrders = (state, layoutBlockOrders) => {
  Vue.set(state, 'layoutBlockOrder', layoutBlockOrders)
}

export const setLayoutBlockFlow = (state, layoutBlockFlowValue) => {
  Vue.set(state.layoutBlockFlow, layoutBlockFlowValue.blockkey, layoutBlockFlowValue.content)
}

export const setLayoutBlockFlows = (state, layoutBlockFlows) => {
  Vue.set(state, 'layoutBlockFlow', layoutBlockFlows)
}

export const setLayoutBlockStructure = (state, layoutBlockStructure) => {
  Vue.set(state, 'layoutBlockStructure', layoutBlockStructure)
}

export const setCurrentLayoutBlock = (state, currentLayoutBlock) => {
  state.currentLayoutBlock = currentLayoutBlock
}

export const setValueSetting = (state, value) => {
  Vue.set(state.valueSettings, value.id, value.valueSetting)
  console.log(JSON.stringify(state.valueSettings))
}

export const removeValueSetting = (state, value) => {
  // value = {id, key}, id is the index of valueSettings, key is the id of item in valueSetting
  let _valueSetting = state.valueSettings[value.id]
  for (let i = 0; i < _valueSetting.length; i++) {
    if (_valueSetting[i].id === value.key) {
      _valueSetting.splice(i, 1)
    }
  }
  console.log(_valueSetting)
  // Vue.set(state, 'valueSettings', _valueSetting)
}

export const setValueSettings = (state, valueSettings) => {
  Vue.set(state, 'valueSettings', valueSettings)
}

export const updateQuestionVariable = (state, questionVariable) => {
  Vue.set(state.questionVariables, questionVariable.key, questionVariable)
}

export const setQuestionVariables = (state, questionVariables) => {
  Vue.set(state, 'questionVariables', questionVariables)
}

export const addQuestionVariable = (state, questionVariable) => {
  if (typeof state.questionVariables === 'undefined') {
    state.questionVariables = {}
  }
  Vue.set(state.questionVariables, questionVariable.key, questionVariable)
}

export const removeQuestionVariable = (state, variableKey) => {
  if (typeof state.questionVariables === 'undefined') {
    state.questionVariables = {}
  }
  Vue.delete(state.questionVariables, variableKey)
}

export const setVariables = (state, variables) => {
  Vue.set(state, 'variables', variables)
}

export const setAnswers = (state, answers) => {
  Vue.set(state, 'answers', answers)
}

export const setMultiAnswers = (state, multiAnswers) => {
  Vue.set(state, 'multiAnswers', multiAnswers)
}

export const setRepeatableBlocks = (state, repeatableBlocks) => {
  Vue.set(state, 'repeatableBlocks', repeatableBlocks)
}

export const setRepeatableIndexes = (state, repeatableIndexes) => {
  Vue.set(state, 'repeatableIndexes', repeatableIndexes)
}

export const setGeoBoards = (state, geoBoards) => {
  Vue.set(state, 'geoBoards', geoBoards)
}

export const setResultBlocks = (state, resultBlocks) => {
  Vue.set(state, 'resultBlocks', resultBlocks)
}

export const setDropDownBlocks = (state, dropDownBlocks) => {
  Vue.set(state, 'dropDownBlocks', dropDownBlocks)
}

export const setOptionBlocks = (state, optionBlocks) => {
  Vue.set(state, 'optionBlocks', optionBlocks)
}

export const setRadioButtonBlocks = (state, radioButtonBlocks) => {
  Vue.set(state, 'radioButtonBlocks', radioButtonBlocks)
}

export const setStackingMultiplications = (state, stackingMultiplications) => {
  Vue.set(state, 'stackingMultiplications', stackingMultiplications)
}

export const setStackingDivisions = (state, stackingDivisions) => {
  Vue.set(state, 'stackingDivisions', stackingDivisions)
}