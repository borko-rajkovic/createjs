import { mapState } from 'vuex'

export default {
  data () {
    return {
      contents: [],
      compositeContents: [],
      compositeContentsStr: '',
      showViewer: false,
      showCompositeViewer: false,
      title: '',
      id: '',
      noOfQuestion: 3,
      checkResult: true,
      retry: false,
      noOfRetry: 1,
      questionIndex: '',
      published: 'N',
      schoolGroups: [],
      codePaper: false,
      groupUsers: [],
      startDate: '',
      endDate: ''
    }
  },
  computed: {
    questionPrefix () {
      if (this.contentMode === 'do') {
        if (this.currentPaperId !== '' && this.currentQuestionIndex !== '') {
          return this.currentPaperId + '-' + this.currentQuestionIndex + '-'
        }
      }
      return ''
    },
    resultId () {
      // for contentBlock, it's questionPrefix
      // for compositeContent, it's questionPrefix + currentOrder
      if (this.contentType === 'contentBlock') {
        return this.questionPrefix
      }
      else if (this.contentType === 'compositeContent') {
        return this.questionPrefix + this.currentOrder
      }
    },
    currentOrder () {
      return this.layoutBlockPreviewControl['currentOrder'] || 1
    },
    noOfQuestionValue () {
      if (isNaN(this.noOfQuestion)) {
        this.$store.commit('response/setNoOfQuestion', 1)
        return 1
      }
      else {
        this.$store.commit('response/setNoOfQuestion', parseInt(this.noOfQuestion))
        return parseInt(this.noOfQuestion)
      }
    },
    /*
    contentType () {
      if (typeof this.contents[this.questionIndex] !== 'undefined' && this.contents[this.questionIndex] !== null) {
        return 'contentBlock'
      }
      else
      if (typeof this.compositeContents[this.questionIndex] !== 'undefined' && this.compositeContents[this.questionIndex] !== null) {
        return 'compositeContent'
      }
    },
    */
    ...mapState({
      valueSettings: state => state.composer.valueSettings,
      answers: state => state.composer.answers,
      variables: state => state.composer.variables,
      questionVariables: state => state.composer.questionVariables,
      localQuestionVariables: state => state.composer.localQuestionVariables,
      localVariables: state => state.composer.localVariables,
      localAnswers: state => state.composer.localAnswers,
      localValueSettings: state => state.composer.localValueSettings,
      contentFontSize: state => state.composer.contentFontSize,
      layoutBlockContent: state => state.composer.layoutBlockContent,
      contentType: state => state.composer.contentType,
      layoutBlockPreviewControl: state => state.composer.layoutBlockPreviewControl,
      currentPaperId: state => state.response.currentPaperId,
      currentQuestionIndex: state => state.response.currentQuestionIndex,
      token: state => state.security.token,
      response: state => state.response,
      lastUpdate: state => state.response.lastUpdate,
      userGroups: state => state.report.userGroups,
      schoolUsers: state => state.report.schoolUsers,
      paperUserGroups: state => state.report.paperUserGroups
    })
  },
  methods: {
    loadPaperUserGroup (cb) {
      this.$axios.post('/api/school_groups/getPaperSchoolGroups',
        this.$qs.stringify(
          { paperId: this.id }
        ),
        { headers: { 'x-access-token': this.token.id } })
        .then((response) => {
          console.log(response)
          this.schoolGroups = response.data
          if (this.schoolGroups.length > 0) {
            this.schoolId = this.schoolGroups[0].schoolId
          }
          if (cb) {
            cb()
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            this.$router.push('/login')
          }
          console.log(error)
        })
    },
    loadSchoolUsers (cb) {
      console.log('loadSchoolUsers')
      if (typeof this.schoolUsers[this.selectedSchoolGroupId] !== 'undefined') {
        this.groupUsers = this.schoolUsers[this.selectedSchoolGroupId]
        if (cb) {
          cb()
        }
      }
      else {
        this.$axios.post('/api/user_groups/getGroupUsers',
          this.$qs.stringify(
            { schoolGroupId: this.selectedSchoolGroupId }
          ),
          { headers: { 'x-access-token': this.token.id } })
          .then((response) => {
            console.log(response)
            this.groupUsers = response.data
            this.$store.commit('report/setSchoolUser', { groupId: this.selectedSchoolGroupId, schoolUsers: this.groupUsers })
            if (cb) {
              cb()
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              this.$router.push('/login')
            }
            console.log(error)
          })
      }
    },
    saveResponse () {
      if (this.doPaper && this.questionIndex !== '') {
        let _response = this.response
        let _questionPrefix = this.questionPrefix
        let _questionResponse = {}
        let _ = this.$_

        if (typeof this.lastUpdate[_questionPrefix] !== 'undefined') {
          Object.keys(_response).forEach(function(key) {
            var _val = _response[key]
            if (key !== 'lastUpdate') {
              if (_.isObject(_val)) {
                let _properties = {}
                Object.keys(_val).forEach(function(pKey) {
                  if (pKey.startsWith(_questionPrefix)) {
                    _properties[pKey] = _val[pKey]
                  }
                })
                if (!_.isEmpty(_properties)) {
                  _questionResponse[key] = _properties
                }
              }
            }
          })
          if (typeof _response['currentLayoutBlockOrder'] !== 'undefined') {
            _questionResponse['currentLayoutBlockOrder'] = _response['currentLayoutBlockOrder']
          }
          if (!this.$_.isEmpty(_questionResponse)) {
            let _value = JSON.stringify(_questionResponse) // this.$lzString.compress(JSON.stringify(_questionResponse))

            this.$axios.post('/api/user_responses/saveUserResponse',
              this.$qs.stringify(
                { questionIndex: this.questionIndex, value: _value, paperId: this.currentPaperId }
              ),
              { headers: { 'x-access-token': this.token.id } })
              .then((response) => {
                console.log(response)
                this.$store.commit('response/removeLastUpdate', _questionPrefix)
              })
              .catch((error) => {
                if (error.response && error.response.status === 403) {
                  this.$router.push('/login')
                }
                console.log(error)
              })

          }
        }
      }
    },
    selectIndex (index) {
      console.log('selectIndex')
      if (this.doPaper && this.questionIndex !== '') {
        this.saveResponse()
      }
      this.questionIndex = index
      // this.$store.commit('response/resetHintBlocks')
      this.$store.commit('composer/resetLocalValueSettings')
      this.$store.commit('composer/resetLocalQuestionVariables')
      this.questionIndex = index
      this.showViewer = false
      this.showCompositeViewer = false

      this.$store.commit('response/setCurrentQuestionIndex', this.questionIndex)

      if (typeof this.contents[this.questionIndex] !== 'undefined' && this.contents[this.questionIndex] !== null) {
        this.$store.commit('composer/setContentType', 'contentBlock')
        this.$nextTick(() => {
          this.showViewer = true
        })
      }
      else
      if (typeof this.compositeContents[this.questionIndex] !== 'undefined' && this.compositeContents[this.questionIndex] !== null) {
        this.$store.commit('composer/setContentType', 'compositeContent')
        this.compositeContent = this.compositeContents[index]
        this.initContent()
        this.$nextTick(() => {
          this.showCompositeViewer = true
        })
      }
    },
    loadCategory (categories) {
      let _categories = []
      for (let i = 0; i < categories.length; i++) {
        _categories.push(categories[i].category)
      }
      this.$store.commit('composer/setSelectedCategories', _categories)
    },
    loadPaperContent (cb) {
      this.$axios.post('/api/paper_contents/getPaperContent',
        this.$qs.stringify(
          { id: this.$route.params.id }
        ),
        { headers: { 'x-access-token': this.token.id } })
        .then((response) => {
          console.log(response)
          let _paperContent = response.data.paperContent
          this.title = _paperContent.title
          this.noOfQuestion = _paperContent.no_of_question
          this.$store.commit('response/setNoOfQuestion', this.noOfQuestion)
          this.setting = JSON.parse(_paperContent.setting)
          this.published = _paperContent.published
          this.schoolGroups = response.data.schoolGroups
          this.startDate = _paperContent.start_date
          this.endDate = _paperContent.end_date
          this.codePaper = _paperContent.support_code === 'Y' ? true : false
          if (this.setting && typeof this.setting.checkResult !== 'undefined') {
            this.checkResult = this.setting.checkResult
          }
          if (this.setting && typeof this.setting.retry !== 'undefined') {
            this.retry = this.setting.retry
          }
          if (this.setting && typeof this.setting.noOfRetry !== 'undefined') {
            this.noOfRetry = this.setting.noOfRetry
          }
          else {
            this.checkResult = false
          }
          this.contents = JSON.parse(_paperContent.content_blocks)
          this.compositeContents = JSON.parse(_paperContent.composite_contents)
          if (response.data.paperCategories) {
            this.loadCategory(response.data.paperCategories)
          } else {
            this.loadCategory([])
          }
          if (cb) {
            cb()
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            this.$router.push('/login')
          }
          console.log(error)
        })
    }
  }
}