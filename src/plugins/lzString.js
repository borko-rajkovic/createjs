import lzString from 'lz-string'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$lzString = lzString
}
