<template>
  <div style="padding: 1em;">
    <q-table
      title="School List"
      :data="tableData"
      :columns="columns"
      row-key="name">
      <q-td slot="body-cell-edit" slot-scope="props" :props="props">
        <q-btn @click="editSchool(props.value)" size="sm" color="secondary">Edit</q-btn>
      </q-td>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'school-management',
  data: () => ({
    columns: [
      { name: 'schoolName', required: true, label: 'School Name', align: 'left', field: 'name', sortable: true },
      { name: 'noOfGroup', required: true, label: 'No. of group', align: 'right', field: 'noOfGroup', sortable: false },
      { name: 'noOfTeacher', required: true, label: 'No. of teacher', align: 'right', field: 'noOfTeacher', sortable: false },
      { name: 'noOfStudent', required: true, label: 'No. of student', align: 'right', field: 'noOfStudent', sortable: false },
      { name: 'edit', required: true, label: '', align: 'center', field: 'edit', sortable: false }
    ],
    schools: []
    /* ,
    tableData: [
      {
        name: 'School A',
        noOfGroup: 3,
        noOfTeacher: 10,
        noOfStudent: 200,
        edit: 1
      }
    ]
    */
  }),
  computed: {
    tableData () {
      console.log('tableData: ' + this.schools.length)
      let _tableData = []
      for (let i = 0; i < this.schools.length; i++) {
        _tableData[i] = {}
        _tableData[i]['name'] = this.schools[i]['name']
        _tableData[i]['noOfGroup'] = 0
        _tableData[i]['noOfTeacher'] = 0
        _tableData[i]['noOfStudent'] = 0
        _tableData[i]['edit'] = this.schools[i]['id']
      }
      return _tableData
    }
  },
  methods: {
    editSchool (id) {
      this.$router.push('/school/' + id)
    },
    loadSchools () {
      this.$axios.post('/api/schools/getSchools',
        this.$qs.stringify(
          {}
        ))
        .then((response) => {
          console.log(response)
          this.schools = response.data.schools
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  mounted () {
    this.loadSchools()
  }
}
</script>
