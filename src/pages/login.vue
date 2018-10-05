<template>
  <div style="text-align: center; padding: 5em 2em;">
    <div style="border: 1px solid #999; border-radius: 5px; margin: 0 auto; max-width: 30em; text-align: left; padding: 1em;">
      <div style="display: flex; padding: 1em; align-items: center;">
        <div style="flex: 1">{{$t('title.username', $profile.lang)}}: </div>
        <div style="flex: 3"><q-input @input="userInput" v-model="username" /></div>
      </div>
      <div style="display: flex; padding: 1em; align-items: center;">
        <div style="flex: 1">{{$t('title.password', $profile.lang)}}: </div>
        <div style="flex: 3"><q-input @input="userInput" type="password" v-model="password" /></div>
      </div>
      <div style="text-align: center; padding: 1em;">
        <q-btn color="positive" @click="login">{{$t('button.login', $profile.lang)}}</q-btn>
      </div>
    </div>
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="incorrect" style="text-align: center; padding: 1.5em;" class="text-negative">{{$t('message.incorrect_username_or_password', $profile.lang)}}</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      username: 'user1',
      password: 'password',
      incorrect: false
    }
  },
  methods: {
    userInput () {
      this.incorrect = false
    },
    login () {
      this.$q.loading.show()
      this.$axios.post('/api/authenticate',
        this.$qs.stringify(
          { username: this.username, password: this.password }
        ))
        .then((response) => {
          console.log(response.data)
          this.token = response.data.token
          this.$store.commit('security/setToken', response.data.token)
          this.$q.notify({ message: this.$t('message.login_successfully', this.$profile.lang), timeout: 1000, color: 'positive' })
          this.$router.push('/')
          this.$q.loading.hide()
        })
        .catch((error) => {
          /*
          if (error.response.status === 403) {
            this.$router.push('/login')
          }
          */
          console.log(error)
          console.log('login problem')
          this.$q.loading.hide()
        })
    }
  }
}
</script>
