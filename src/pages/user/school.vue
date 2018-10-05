<template>
  <div style="text-align: center;">
    <q-card style="padding: 1em; width: 30em; margin: 2em auto;">
      <div style="display: flex; align-items: center;">
        <div>Name:</div>
        <div style="padding: 0 1em;">
          <q-input v-model="school.name" />
        </div>
      </div>
      <div style="text-align: center; padding-top: 2em;">
        <q-btn color="primary">Save</q-btn>
        <q-btn color="primary">Back</q-btn>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'school',
  data () {
    return {
      school: {}
    }
  },
  methods: {
    loadSchool () {
      this.$axios('/api/schools/getSchool?id=' + this.$route.params.id)
        .then((response) => {
          console.log(response)
          this.school = response.data.school
        })
        .catch((error) => {
          console.log(error)
        })
      }
  },
  mounted () {
    this.loadSchool()
  }
}
</script>
