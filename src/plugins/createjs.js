import createjs from 'createjs'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$createjs = createjs
}
