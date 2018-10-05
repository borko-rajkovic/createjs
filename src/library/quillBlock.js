import Quill from 'quill'
let BlockEmbed = Quill.import('blots/embed')
let QuillBlock = Quill.import('blots/block')
let QuillInline = Quill.import('blots/inline')
let GUARD_TEXT = '\uFEFF'
class GeoBoardBlot extends BlockEmbed {
  static create(value) {
    let node = super.create(value)
    node.setAttribute('nodeValue', value.value)
    node.setAttribute('id', value.id)
    var contentNode = document.createElement('span')
    contentNode.setAttribute('contenteditable', false)
    contentNode.innerHTML = ' <u>' + value.value + '</u> '
    var leftGuard = document.createTextNode(GUARD_TEXT)
    var rightGuard = document.createTextNode(GUARD_TEXT)
    node.appendChild(leftGuard)
    node.appendChild(contentNode)
    node.appendChild(rightGuard)
    return node
  }

  static value(node) {
    return {
      value: node.getAttribute('nodeValue'),
      id: node.getAttribute('nodeId')
    };
  }
}
GeoBoardBlot.blotName = 'geoBlock'
GeoBoardBlot.tagName = 'span'
GeoBoardBlot.className = 'ql-geo-block'

class BaseBlockBlot extends BlockEmbed {
  static create(value) {
    let node = super.create(value)
    node.setAttribute('nodeValue', value.value)
    node.setAttribute('nodeType', value.type)
    node.setAttribute('id', value.id)
    // node.setAttribute('editable', value.editable)
    var contentNode = document.createElement('span')
    // contentNode.setAttribute('contenteditable', value.editable)
    contentNode.innerHTML = ' <u>' + value.value + '</u> '
    // var leftGuard = document.createTextNode(GUARD_TEXT)
    // var rightGuard = document.createTextNode(GUARD_TEXT)
    // node.appendChild(leftGuard)
    node.appendChild(contentNode)
    // node.appendChild(rightGuard)
    // super.contentNode.setAttribute('contenteditable', true)
    return node
  }

  static value(node) {
    return {
      value: node.getAttribute('nodeValue'),
      id: node.getAttribute('id'),
      type: node.getAttribute('nodeType'),
      // editable: node.getAttribute('editable')
    };
  }
}

BaseBlockBlot.blotName = 'baseBlockBlot'
BaseBlockBlot.tagName = 'span'
BaseBlockBlot.className = 'ql-base-block'



class EditableBlock extends QuillInline {
  static create(value) {
    let node = super.create()
    node.setAttribute('nodeValue', value.value)
    node.setAttribute('nodeType', value.type)
    node.setAttribute('id', value.id)
    // let node = super.create();
    // Sanitize url value if desired
    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
    node.setAttribute('nodeType', value.type)
    var contentNode = document.createElement('span')
    contentNode.innerHTML = value.value
    var leftGuard = document.createTextNode(GUARD_TEXT)
    var rightGuard = document.createTextNode(GUARD_TEXT)
    // node.appendChild(leftGuard)
    node.appendChild(contentNode)
    // node.appendChild(rightGuard)
    return node;
  }

  static value(node) {
    return {
      value: node.getAttribute('nodeValue'),
      id: node.getAttribute('id'),
      type: node.getAttribute('nodeType')
    }
  }
}
EditableBlock.blotName = 'editableBlockBlot'
EditableBlock.tagName = 'div'
EditableBlock.className = 'ql-editable-block'

export { GeoBoardBlot, BaseBlockBlot, EditableBlock }
