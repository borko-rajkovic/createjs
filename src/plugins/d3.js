import * as d3 from 'd3'
import * as legend from 'd3-svg-legend'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$d3 = d3
  Vue.prototype.$d3legend = legend
}
