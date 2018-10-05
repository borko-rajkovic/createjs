import qrcode from 'qrcode'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$qrcode = qrcode
}
