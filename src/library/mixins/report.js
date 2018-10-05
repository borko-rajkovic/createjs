export default {
  data () {
    return {
      codePaperResponse: [],
      selectedSchoolGroup: '',
      showDetailReport: false,
      selectedQuestionIndex: ''
    }
  },
  computed: {
    schoolGroupOptions () {
      let _options = []
      for (let i = 0; i < this.schoolGroups.length; i++) {
        _options.push({
          label: this.schoolGroups[i]['name'],
          value: this.schoolGroups[i]['id']
        })
      }
      return _options
    }
  },
  methods: {
    loadCodePaperResponse (cb) {
      this.$axios.post('/api/code_paper_responses/getCodePaperResponse',
        this.$qs.stringify(
          { paperId: this.id }
        ),
        { headers: { 'x-access-token': this.token.id } })
        .then((response) => {
          console.log(response)
          this.codePaperResponse = response.data
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
  }
}