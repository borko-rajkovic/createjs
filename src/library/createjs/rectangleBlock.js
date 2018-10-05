import createjs from 'createjs'

(function() {

  // function Button(label, color, callback) {
  function RectangleBlock(props) {
    console.log(props)
    this.Container_constructor()
    
    this.width = props.width
    this.height = props.height
    this.verticalMargin = typeof props.verticalMargin !== 'undefined' ? props.verticalMargin : 20
    this.horizontalMargin = typeof props.horizontalMargin !== 'undefined' ? props.horizontalMargin : 30
    this.blockFillColor = props.blockFillColor
    this.blockStrokeColor = props.blockStrokeColor
    this.label = props.label || ''
    this.callback = props.callback
    this.correct = props.correct

    this.totalWidth = this.width + this.horizontalMargin * 2
    this.totalHeight = this.height + this.verticalMargin * 2
    
    this.setup()
  }
  var p = createjs.extend(RectangleBlock, createjs.Container)
  
  
  p.setup = function() {
    var text = new createjs.Text(this.label, '20px Arial', '#000')
    text.textBaseline = 'top'
    text.textAlign = 'center'
    
    var width = (this.width ? this.width : text.getMeasuredWidth()) + this.horizontalMargin
    var height = (this.height ? this.height : text.getMeasuredHeight()) + this.verticalMargin
    
    text.x = width/2
    text.y = this.verticalMargin / 2 + (this.height - 20) / 2
    
    var background = new createjs.Shape()
    background.graphics.beginStroke(this.blockStrokeColor).setStrokeStyle(1).beginFill(this.blockFillColor).drawRect(0, 0, width, height)
    background.shadow = new createjs.Shadow('#ccc', 2, 2, 3)
    
    this.addChild(background, text) 
    this.on('click', this.handleClick)
    this.on('rollover', this.handleRollOver)
    this.on('rollout', this.handleRollOver)
    this.cursor = 'pointer'
  
    this.mouseChildren = false
    
    this.offset = Math.random() * 10
    this.count = 0
  } 
  
  p.handleClick = function (event) {
    if (this.callback) {
      this.callback()
    }
    // alert('You clicked on a button: '+this.label)
  } 
  
  p.handleRollOver = function(event) {       
    this.alpha = event.type == 'rollover' ? 0.4 : 1
  }
  
  window.RectangleBlock = createjs.promote(RectangleBlock, 'Container')
  }())

  export default RectangleBlock