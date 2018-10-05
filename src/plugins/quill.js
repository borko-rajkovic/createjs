import quill from 'quill'
import ImageResize from 'quill-image-resize-module'
import { GeoBoardBlot, BaseBlockBlot } from '../library/quillBlock'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  window.Quill = quill
  Vue.prototype.$quill = quill
  Vue.prototype.$quill.register(GeoBoardBlot)
  Vue.prototype.$quill.register(BaseBlockBlot)
  Vue.prototype.$quill.register('modules/imageResize', ImageResize)
}
