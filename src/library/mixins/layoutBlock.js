import { mapState } from 'vuex'
export default {
  data () {
    return {
      defaultLayout: 'vertical'
    }
  },
  computed: {
    structure () {
      return this.layoutBlockStructure
    },
    currentBlockNoOfChild () {
      if (this.currentLayoutBlock !== null) {
        let _block = this.searchBlock(this.structure)
        if (_block.children) {
          return this.$_.size(_block.children)
        }
        else {
          return 0
        }
      }
    },
    currentBlockName () {
      return 'Level' + this.currentBlockLevel + this.currentBlockIndexName
    },
    currentBlockLevel () {
      return this.findCurrentBlockLevel(this.structure, 1)
    },
    currentBlockIndexName () {
      let _index = this.currentBlockIndex
      if (_index === -1) {
        return ''
      }
      else {
        return String.fromCharCode(65 + _index)
      }
    },
    currentBlockIndex () {
      if (this.currentLayoutBlock === this.rootBlockKey) {
        return -1
      }
      else {
        return this.findCurrentBlockIndex(this.structure)
      }
    },
    rootBlockKey () {
      if (this.structure) {
        return Object.keys(this.structure)[0]
      }
      else {
        return ''
      }
    },
    layout () {
      let _layout = this.searchBlockLayout(this.structure)
      if (_layout === '') {
        return this.defaultLayout
      }
      else {
        return _layout
      }
    },
    ...mapState({
      currentLayoutBlock: state => state.composer.currentLayoutBlock,
      layoutBlockStructure: state => state.composer.layoutBlockStructure,
      layoutBlockContent: state => state.composer.layoutBlockContent,
      layoutBlockFlow: state => state.composer.layoutBlockFlow,
      localQuestionVariables: state => state.composer.localQuestionVariables,
      localVariables: state => state.composer.localVariables,
      localAnswers: state => state.composer.localAnswers,
      localValueSettings: state => state.composer.localValueSettings
    })
  },
  methods: {
    findCurrentBlockIndex (structure) {
      // -1 mean only one child, index starts from 0
      let _key = Object.keys(structure)[0]
      let _count = 0
      if (structure[_key]) {
        for (let _childBlockKey in structure[_key].children) {
          if (_childBlockKey === this.currentLayoutBlock) {
            if (this.$_.size(structure[_key].children) > 1) {
              return _count
            }
            else {
              return -1
            }
          }
          _count++
        }
      }
      // not found in this level, go to next level
      let _result = ''
      if (structure[_key]) {
        for (let _childBlockKey in structure[_key].children) {
          let _structure = {}
          _structure[_childBlockKey] = structure[_key].children[_childBlockKey]
          let _return = this.findCurrentBlockIndex(_structure)
          if (_return !== '') {
            _result = _return
          }
        }
      }
      return _result
    },
    findCurrentBlockLevel (structure, level) {
      let _key = Object.keys(structure)[0]
      if (_key === this.currentLayoutBlock) {
        return level
      }
      else {
        let _result = ''
        if (structure[_key]) {
          for (let _childBlockKey in structure[_key].children) {
            let _structure = {}
            _structure[_childBlockKey] = structure[_key].children[_childBlockKey]
            let _return = this.findCurrentBlockLevel(_structure, level + 1)
            if (_return !== '') {
              _result = _return
            }
          }
        }
        return _result
      }
    },
    searchBlock (structure, targetBlockKey) {
      let _targetBlockKey = targetBlockKey || this.currentLayoutBlock
      let _blockkey = Object.keys(structure)[0]
      if (_targetBlockKey === Object.keys(structure)[0]) {
        return structure[_targetBlockKey]
      }
      else {
        if (structure[_blockkey] && structure[_blockkey].children) {
          for (let _childBlockKey in structure[_blockkey].children) {
            let _structure = {}
            _structure[_childBlockKey] = structure[_blockkey].children[_childBlockKey]
            let _block = this.searchBlock(_structure, targetBlockKey)
            if (_block !== '') {
              return _block
            }
          }
        }
      }
      return ''
    },
    searchBlockLayout (block) {
      let _block = this.searchBlock(block)
      if (_block !== '') {
        return _block.layout
      }
      else {
        return ''
      }
    }
  }
}