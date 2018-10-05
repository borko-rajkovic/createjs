import { mapState } from 'vuex'

export default {
  data () {
    return {
      compositeContent: {}
    }
  },
  computed: {
    ...mapState({
      token: state => state.security.token
    })
  },
  methods: {
    loadCompositeContents () {
      console.log('load composite content')
      let _categories = []
      for (let _key in this.searchCategories) {
        _categories.push(this.searchCategories[_key])
        // _categories.push({ category: this.searchCategories[_key]})
      }
      this.$axios.post('/api/composite_contents/getCompositeContents',
        this.$qs.stringify(
          {categories: this.searchCategories}
        ),
        { headers: { 'x-access-token': this.token.id } })
        .then((response) => {
          console.log(response)
          this.compositeContents = response.data
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            this.$router.push('/login')
          }
          console.log(error)
        })
    },
    initContent () {
      console.log('init 2')
      if (this.compositeContent.structure) {
        try {
          let _structure = JSON.parse(this.compositeContent.structure)
          this.$store.commit('composer/setLayoutBlockStructure', _structure)
        }
        catch (e) {
          console.log(e)
        }
      }
      if (this.compositeContent.hint) {
        try {
          let _blockHint = JSON.parse(this.compositeContent.hint)
          for (let _key in _blockHint) {
            this.$store.commit('composer/addLayoutBlockHint', _key)
          }
        }
        catch (e) {
          console.log(e)
        }
      }
      if (this.compositeContent.flow) {
        try {
          let _layoutBlockFlow = JSON.parse(this.compositeContent.flow)
          this.$store.commit('composer/setLayoutBlockFlows', _layoutBlockFlow)
        }
        catch (e) {
          console.log(e)
        }
      }
      if (this.compositeContent.block_order) {
        try {
          let _layoutBlockOrder = JSON.parse(this.compositeContent.block_order)
          this.$store.commit('composer/setLayoutBlockOrders', _layoutBlockOrder)
        }
        catch (e) {
          console.log(e)
        }
      }
      if (this.compositeContent.content) {
        try {
          let _layoutBlockContent = JSON.parse(this.compositeContent.content)
          console.log(_layoutBlockContent)
          this.blockContent = this.compositeContent.content
          this.$store.commit('composer/setLayoutBlockContents', _layoutBlockContent)
          this.setContentBlock()

        }
        catch (e) {
          console.log(e)
        }
      }
      if (this.compositeContent.title) {
        this.$store.commit('composer/setLayoutBlockTitle', this.compositeContent.title)
      }
      this.resetLayoutBlockPreview()
    },
    reset () {
      this.$store.commit('composer/setLayoutBlockStructure', JSON.parse(this.defaultBlockStructure))
      this.$store.commit('composer/removeLayoutBlockHint')
      this.$store.commit('composer/setLayoutBlockFlows', {})
      this.$store.commit('composer/setLayoutBlockOrders', {})
      this.$store.commit('composer/setLayoutBlockTitle', '')
      this.$store.commit('composer/setCurrentLayoutBlock', 'root')
      this.$store.commit('composer/setLayoutBlockPreviewControl', { currentOrder: 1 })
      this.$store.commit('composer/setSelectedCategories', [])
    },
    resetLayoutBlockPreview () {
      this.$store.commit('composer/setLayoutBlockPreview', {})
      this.$store.commit('composer/setLayoutBlockPreviewControl', { currentOrder: 1 })
    },
    loadLayoutBlockContent () {
      if (this.blockContent) {
        let _layoutBlockContent = JSON.parse(this.blockContent)
        let _layoutBlockContents = {}
        for (let _blockkey in _layoutBlockContent) {
          let _content = this.getContentById(_layoutBlockContent[_blockkey]['id'])
          _layoutBlockContents[_blockkey] = _content
          this.setLocalValues(_blockkey, _content)
          if (_layoutBlockContent[_blockkey]['questionVariables']) {
            this.setLocalQuestionVariables(_blockkey, _layoutBlockContent[_blockkey]['questionVariables'])
          }
        }
        this.$store.commit('composer/setLayoutBlockContents', _layoutBlockContents)
      }
    },
    loadLayoutBlockFlow () {
      if (this.blockFlow) {
        let _layoutBlockFlow = JSON.parse(this.blockFlow)
        this.$store.commit('composer/setLayoutBlockFlows', _layoutBlockFlow)
      }
    },
    setLocalQuestionVariables (blockkey, questionVariables) {
      let _localQuestionVariables = this.localQuestionVariables || {}
      _localQuestionVariables[blockkey] = questionVariables
      this.$store.commit('composer/setLocalQuestionVariables', _localQuestionVariables)
    },
    setLocalValues (blockkey, content) {
      if (content.questionVariables) {
        let _localQuestionVariables = this.localQuestionVariables 
        _localQuestionVariables[blockkey] = JSON.parse(content.questionVariables)
        this.$store.commit('composer/setLocalQuestionVariables', _localQuestionVariables)
      }

      if (content.variables) {
        let _localVariables = this.localVariables
        _localVariables[blockkey] = JSON.parse(content.variables)
        this.$store.commit('composer/setLocalVariables', _localVariables)
      }

      if (content.answers) {
        let _localAnswers = this.localAnswers
        _localAnswers[blockkey] = JSON.parse(content.answers)
        this.$store.commit('composer/setLocalAnswers', _localAnswers)
      }

      if (content.geoBoards) {
        let _localGeoBoards = this.localGeoBoards
        _localGeoBoards[blockkey] = JSON.parse(content.geoBoards)
        this.$store.commit('composer/setLocalGeoBoards', _localGeoBoards)
      }

      if (content.valueSettings) {
        let _localValueSettings = this.localValueSettings
        _localValueSettings[blockkey] = JSON.parse(content.valueSettings)
        this.$store.commit('composer/setLocalValueSettings', _localValueSettings)
      }
    },
    loadCategory (compositeContentCategories) {
      let _categories = []
      for (let i = 0; i < compositeContentCategories.length; i++) {
        _categories.push(compositeContentCategories[i].category)
      }
      this.$store.commit('composer/setSelectedCategories', _categories)
    },
    setContentBlock () {
      console.log('------------')
      console.log('setContentBlock')
      console.log(this.layoutBlockContent)
      for (let _key in this.layoutBlockContent) {
        console.log(_key)
        this.setLocalValues(_key, this.layoutBlockContent[_key])
      }
    }
  }
}