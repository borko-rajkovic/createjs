import { mapState } from 'vuex'

export default {
  data () {
    return {
      contentBlocks: [],
      codeContentBlocks: []
    }
  },
  computed: {
    ...mapState({
      searchCategories: state => state.composer.searchCategories,
      token: state => state.security.token
    })
  },
  methods: {
    loadCodeContentBlocks () {
      let _categories = []
      for (let _key in this.searchCategories) {
        _categories.push(this.searchCategories[_key])
      }
      this.$axios.post('/api/code_content_blocks/getCodeContentBlocks',
        this.$qs.stringify(
          { categories: _categories }
        ),
        { headers: { 'x-access-token': this.token.id } })
        .then((response) => {
          console.log(response)
          this.codeContentBlocks = response.data
        })
        .catch((error) => {
          console.log(error)
          if (error.response && error.response.status === 403) {
            this.$router.push('/login')
          }
        })
    },
    loadContentBlocksByCategory (category) {
      this.$axios.post('/api/content_blocks/getContentBlocks',
        this.$qs.stringify(
          { categories: [category] }
        ),
        { headers: { 'x-access-token': this.token.id } })
        .then((response) => {
          console.log(response)
          this.contentBlocks = response.data
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            this.$router.push('/login')
          }
          console.log(error)
        })
    },
    loadCodeContentBlocksByCategory (category) {
      this.$axios.post('/api/code_content_blocks/getCodeContentBlocks',
        this.$qs.stringify(
          { categories: [category] }
        ),
        { headers: { 'x-access-token': this.token.id } })
        .then((response) => {
          console.log(response)
          this.codeContentBlocks = response.data
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            this.$router.push('/login')
          }
          console.log(error)
        })
    },
    loadCompositeContentsByCategory (category) {
      this.$axios.post('/api/composite_contents/getCompositeContents',
        this.$qs.stringify(
          { categories: [category] }
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
    loadContentBlocks () {
      let _categories = []
      for (let _key in this.searchCategories) {
        _categories.push(this.searchCategories[_key])
        // _categories.push({ category: this.searchCategories[_key]})
      }
      this.$axios.post('/api/content_blocks/getContentBlocks',
        this.$qs.stringify(
          { categories: _categories, titleOnly: true }
        ),
        // { headers: { 'Authorization': this.token.id } })
        { headers: { 'x-access-token': this.token.id } })
        .then((response) => {
          console.log(response)
          this.contentBlocks = response.data
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