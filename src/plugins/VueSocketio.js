import VueSocketio from 'vue-socket.io'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$socketio = VueSocketio
  Vue.use(VueSocketio, 'http://localhost:4000')
  // Vue.use(VueSocketio, 'http://172.104.161.25:4000')
  // Vue.use(VueSocketio, 'http://139.162.56.21:4000')
}
