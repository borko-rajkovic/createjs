<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="dark"
      >
      <!--
      <q-toolbar
        color="tertiary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
      -->
        <q-btn
          v-if="token"
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          ACT
          <div slot="subtitle">After Class Tutor</div>
          
        </q-toolbar-title>
        <q-btn @click="logout"
              v-if="loggedIn"
              side="right"
              flat round dense
              icon="power_settings_new">
          <q-tooltip>{{$t('title.logout', $profile.lang)}}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>{{$t('menu.menu', $profile.lang)}}</q-list-header>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
      <q-layout-footer v-if="showFooter" color="tertiary">
        <div style="display: flex;">
          <div style="flex: 1;"><paper-button></paper-button></div>
          <div style="margin: 0.5em;" v-if="backPath !== ''">
            <q-btn @click="goBack" color="secondary" round icon="reply">
              <q-tooltip>{{$t('title.back', $profile.lang)}}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-layout-footer>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
import { openURL } from 'quasar'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: false // this.$q.platform.is.desktop
    }
  },
  computed: {
    loggedIn () {
      if (this.$_.isEmpty(this.token)) {
        return false
      }
      else {
        return true
      }
    },
    showFooter () {
      if (this.showQuestionNumber) {
        return true
      }
      else {
        return false
      }
    },
    ...mapState({
      showQuestionNumber: state => state.response.showQuestionNumber,
      backPath: state => state.composer.backPath,
      token: state => state.security.token
    })
  },
  methods: {
    goBack () {
      this.$router.push(this.backPath)
    },
    loggedOut () {
      this.$q.notify({ message: this.$t('message.logged_out', this.$profile.lang), timeout: 1000, color: 'positive' })
      localStorage.removeItem('token')
      this.$store.commit('security/setToken', {})
    },
    logout () {
      this.loggedOut()
      /*
      this.$axios.post('/logout',
        this.$qs.stringify(
          { tokenid: this.token.id }
        ))
        .then((response) => {
          console.log(response)
          this.loggedOut()
        })
        .catch((error) => {
          console.log(error)
          this.loggedOut()
        })
      */
    },
    openURL
  }
}
</script>

<style>
</style>
