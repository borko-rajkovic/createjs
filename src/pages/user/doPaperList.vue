<template>
  <div>
    <div style="border: 1px solid #999; margin: 1em; padding: 0.5em; display: inline-block; width: 20em; border-radius: 5px;" :key="paper.id" v-for="paper in nonCodePapers">
      <div style="display: flex; flex-direction: column; font-size: 1.2em;">
        <div style="padding: 0.5em 1em; border-bottom: 1px dashed #999;">{{paper.title}}</div>
        <div style="text-align: center; padding: 1em;">
          <q-knob
            :value="noOfCompleted(paper.id)"
            :min="0"
            :max="paper.no_of_question"
            color="positive"
            readonly
          >{{noOfCompleted(paper.id)}} / {{paper.no_of_question}}</q-knob>
        </div>
        <div style="padding: 0.5em 1em; font-size: 0.8em;">
          {{$t('title.deadline', $profile.lang)}}: {{dayLeft(paper.end_date) + 1}} {{$t('title.day', $profile.lang)}} {{$t('title.left', $profile.lang)}}
        </div>
      </div>
      <div style="text-align: center; padding: 0.5em; border-top: 1px dashed #999;">
        <q-btn no-caps rounded color="positive" @click="doPaper(paper.id)">{{$t('button.start', $profile.lang)}}</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import CommonMixin from '../../library/mixins/common'
import { mapState } from 'vuex'
export default {
  name: 'do-paper-list',
  mixins: [CommonMixin],
  data () {
    return {
      papers: [],
      results: []
    }
  },
  computed: {
    nonCodePapers () {
      return this.$_.filter(this.papers, (paper) => {
        return paper.support_code === 'N'
      })
    },
    ...mapState({
      token: state => state.security.token
    })
  },
  methods: {
    placeholder (paperId) {
      return '$'
    },
    noOfCompleted (paperId) {
      let _count = 0
      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i]['assignedPaperId'] === paperId) {
          _count++
        }
      }
      return _count
    },
    doPaper (paperId) {
      this.$router.push('/do-paper/' + paperId)
    },
    loadPapers () {
      this.$q.loading.show()
      this.$axios.post('/api/paper_contents/getAssignedPapers',
        this.$qs.stringify(
          {}
        ),
        { headers: { 'x-access-token': this.token.id } })
        .then((response) => {
          console.log(response)
          this.papers = response.data.papers
          this.results = response.data.results
          this.$q.loading.hide()
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            this.$router.push('/login')
          }
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    this.loadPapers()
  }
}
</script>
