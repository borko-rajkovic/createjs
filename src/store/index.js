import Vue from 'vue'
import Vuex from 'vuex'

import composer from './composer'
import response from './response'
import security from './security'
import report from './report'
import profile from './profile'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    composer,
    response,
    security,
    report,
    profile
  }
})

export default store
