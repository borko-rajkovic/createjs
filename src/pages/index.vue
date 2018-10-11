<template>
  <q-page class="flex flex-center">
    <div style="font-size: 1.2em">
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  methods: {
  },
  mounted () {
    this.$router.push('/ninja-jump')
  }
}
</script>

<style scoped>
.item {
  margin: 0.5em; padding :0.5em 2em; border: 1px dashed black;
}
</style>
