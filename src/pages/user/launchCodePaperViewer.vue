<template>
  <div>
    <div v-if="currentStage === 1">
      <div style="text-align: center; margin: 1em; font-size: 2em;">Select Group</div>
      <div style="text-align: center; margin: 1em;">
        <div :key="schoolGroup.id" v-for="schoolGroup in schoolGroups" style="display: inline-block; padding: 0.5em;">
          <q-btn no-caps size="lg" rounded color="primary" @click="selectSchoolGroup(schoolGroup.id)">{{schoolGroup.name}}</q-btn>
        </div>
      </div>
    </div>
    <div v-else-if="currentStage === 2" style="text-align: center; padding: 1em 0;">
      <div style="text-align: center; margin: 1em; font-size: 3em;">{{joinInCode}}</div>
      <div style="text-align: center; margin: 1em;">
        <q-btn no-caps size="lg" rounded color="primary" @click="start">Start</q-btn>
      </div>
    </div>
    <div v-else-if="currentStage === 3">
      <div style="margin: 0.5em 2em; display: flex; align-items: center;">
        <div>
          No. of Submission:
        </div>
        <div style="flex: 1; padding: 0 1em;">
          <q-slider label-always :value="noOfSubmission" :min="0" :max="noOfUser" />
        </div>
        <div style="margin: 0em 2em;">
          <q-toggle v-model="submissionDetails" label="Submission Details" />
        </div>
      </div>
      <div :style="'display: flex; padding: 1em; font-size: ' + contentFontSize" v-if="showViewer">
        <div style="flex: 2;">
          <q-card style="padding: 1em; min-height: 10em;">
            <code-content-viewer-container :key="currentQuestionIndex" stage="contentSelection" :content="contents[currentQuestionIndex]"></code-content-viewer-container>
          </q-card>
        </div>
        <transition
          enter-active-class="animated bounceInRight"
          leave-active-class="animated bounceOutRight"
        >
          <div style="flex: 1;" v-if="submissionDetails">
            <q-card style="margin: 0 1em; padding: 1em;">
              <div style="padding: 0.5em 0;" :key="n" v-for="(n, index) in noOfOption">
                {{optionName(n)}}) <div style="display: inline-block; padding: 0 1em;">{{noOfOptionSubmission(index)}}</div>
              </div>
            </q-card>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import PaperMixin from '../../library/mixins/paper'
import CodeContentViewerContainer from '../../components/viewer/codeContentViewerContainer'
export default {
  name: 'launch-code-paper-viewer',
  components: {
    CodeContentViewerContainer
  },
  mixins: [PaperMixin],
  props: ['doPaper'],
  data () {
    return {
      currentStage: 1, // 1 - group selection, 2 - set up device, 3 - ready to answer
      schoolGroups: [],
      selectedSchoolGroupId: '',
      schoolId: '',
      joinInCode: '',
      groupUsers: {},
      userSubmission: {},
      submissionDetails: true,
      noOfOption: 4
    }
  },
  computed: {
    noOfSubmission () {
      if (typeof this.userSubmission === 'undefined') {
        return 0
      }
      else if (typeof this.userSubmission[this.currentQuestionIndex] === 'undefined') {
        return 0
      }
      else {
        return this.$_.size(this.userSubmission[this.currentQuestionIndex])
      }
    },
    noOfUser () {
      return this.$_.size(this.groupUsers)
    },
    key () {
      return this.schoolId + '-' + this.selectedSchoolGroupId + '-' + this.id
    }
  },
  methods: {
    noOfOptionSubmission (index) {
      let optionName = ['A', 'B', 'C', 'D']
      let _count = 0
      if (typeof this.userSubmission === 'undefined') {
        return 0
      }
      else {
        if (this.currentQuestionIndex === '') {
          return 0
        }
        else {
          let _submission = this.userSubmission[this.currentQuestionIndex]
          for (let _key in _submission) {
            if (_submission[_key] === optionName[index]) {
              _count++
            }
          }
        }
      }
      return _count
    },
    optionName (n) {
      return String.fromCharCode(64 + n)
    },
    start () {
      this.currentStage = 3
      this.$store.commit('response/setShowQuestionNumber', true)
      this.setFirstIndex()
    },
    schoolUserLoaded () {
      let _groupUsers = this.groupUsers
      let _codeGroupUsers = {}
      for (let i = 0; i < _groupUsers.length; i++) {
        _codeGroupUsers[_groupUsers[i]['code']] = _groupUsers[i]
      }
      this.groupUsers = _codeGroupUsers
      
      this.currentStage = 2

      this.$nextTick(() => {
        this.$socket.emit('getJoinInCode', this.key)
      })
    },
    selectSchoolGroup (schoolGroupId) {
      this.selectedSchoolGroupId = schoolGroupId
      this.loadSchoolUsers(this.schoolUserLoaded)
    },
    paperContentLoaded () {
      this.loadPaperUserGroup()
    },
    setFirstIndex () {
      this.questionIndex = 0
      this.showViewer = false

      this.$store.commit('response/setCurrentQuestionIndex', this.questionIndex)
      if (typeof this.contents[this.questionIndex] !== 'undefined' && this.contents[this.questionIndex] !== null) {
        this.$store.commit('composer/setContentType', 'contentBlock')
        this.$nextTick(() => {
          this.showViewer = true
        })
      }
    },
    selectQuestionIndex (index) {
      this.questionIndex = index
      this.$store.commit('response/setCurrentQuestionIndex', this.questionIndex)
      this.showViewer = false
      this.$nextTick(() => {
        this.showViewer = true
      })
    }
  },
  created () {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.loadPaperContent(this.paperContentLoaded)
    }
  },
  mounted () {
    this.$store.commit('response/setShowQuestionNumber', false)
    this.$options.sockets.getJoinInCode = (joinInCode) => {
      this.joinInCode = joinInCode
    }
    this.$options.sockets.reconnect = () => {
      console.log("reconnect")
      if (this.joinInCode !== '') {
        this.$socket.emit('join', this.joinInCode)
      }
    }
    this.$options.sockets.code = (info) => {
      this.code = info
      if (this.currentStage === 3) {
        if (typeof this.userSubmission[this.currentQuestionIndex] === 'undefined') {
          Vue.set(this.userSubmission, this.currentQuestionIndex, {})
        }
        let _newSubmission = {}
        for (let _key in this.code) {
          if (typeof this.groupUsers[_key] !== 'undefined') {
            if (typeof this.userSubmission[this.currentQuestionIndex][this.groupUsers[_key]['id']] === 'undefined') {
              if (typeof this.groupUsers[_key] !== 'undefined') {
                _newSubmission[this.groupUsers[_key]['id']] = this.code[_key]
                Vue.set(this.userSubmission[this.currentQuestionIndex], this.groupUsers[_key]['id'], this.code[_key])
                this.$q.notify({ message: this.groupUsers[_key]['name'] + ' submitted', timeout: 3000, color: 'positive' })
              }
            }
            else {
              if (typeof this.groupUsers[_key] !== 'undefined') {
                if (this.userSubmission[this.currentQuestionIndex][this.groupUsers[_key]['id']] !== this.code[_key]) {
                  _newSubmission[this.groupUsers[_key]['id']] = this.code[_key]
                  Vue.set(this.userSubmission[this.currentQuestionIndex], this.groupUsers[_key]['id'], this.code[_key])
                  this.$q.notify({ message: this.groupUsers[_key]['name'] + ' changed answer', timeout: 3000, color: 'positive' })
                }
              }
            }
          }
        }
        if (this.$_.size(_newSubmission) > 0) {
          this.$socket.emit('newSubmission', { record: _newSubmission, questionIndex: this.currentQuestionIndex })
        }
        // console.log(this.userSubmission)
      }
      // console.log(this.code)
    }
    this.$options.sockets.userSubmission = (userSubmission) => {
      Vue.set(this, 'userSubmission', userSubmission)
    }

    this.$root.$on('selectQuestionIndex', this.selectQuestionIndex)
  },
  beforeDestroy() {
    this.$root.$off('selectQuestionIndex', this.selectQuestionIndex)
    this.$store.commit('response/setShowQuestionNumber', false)
    delete this.$options.sockets.getJoinInCode
    delete this.$options.sockets.code
    delete this.$options.sockets.userSubmission
    delete this.$options.sockets.reconnect
  }
}
</script>
