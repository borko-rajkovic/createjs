import md5 from 'md5'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$md5 = md5
}
