<template>
  <div style="display: inline-block;">
    <canvas ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script>
import GameShellMixin from '../library/mixins/gameShell'
export default {
  name: 'game-engine1',
  mixins: [GameShellMixin],
  data () {
    return {
      optionContainers: [],
      noOfOptionContainer: 3,
      iconCheck: null,
      iconCross: null,
      waitForNext: 2000
    }
  },
  methods: {
    init () {
      this.gameShellInit()

      this.queue = new this.$createjs.LoadQueue()
      this.queue.on("complete", this.handleComplete, this)
      let manifest = this.gameShellManifest.concat([
        {id: 'option1BgImg', src: 'statics/game/ninjariver/button1.png'},
        {id: 'option2BgImg', src: 'statics/game/ninjariver/button2.png'},
        {id: 'option3BgImg', src: 'statics/game/ninjariver/button3.png'}
      ])
      manifest = manifest.concat(this.getImageFromQuestion())
      this.queue.loadManifest(manifest)
    },
    handleComplete() {
      this.initGameValues()
      this.setGameShell()
      this.$createjs.Ticker.timingMode = this.$createjs.Ticker.RAF;

      // place option buttons
      this.createOptionContainer (0, 'option1BgImg')
      this.createOptionContainer (1, 'option2BgImg')
      this.createOptionContainer (2, 'option3BgImg')

      this.iconCheck = new this.$createjs.Bitmap(
        this.queue.getResult('iconCheck')
      )
      this.iconCheck.x = this.defaultCanvasWidth / 3
      this.iconCheck.y = this.defaultCanvasHeight / 2
      this.iconCheck.alpha = 0

      this.iconCross = new this.$createjs.Bitmap(
        this.queue.getResult('iconCross')
      )
      this.iconCross.x = this.defaultCanvasWidth / 3
      this.iconCross.y = this.defaultCanvasHeight / 2
      this.iconCross.alpha = 0

      this.stage.addChild(this.iconCheck, this.iconCross)
      
      this.gameStart()
    },
    createOptionContainer (index, bgImage) {
      this.optionContainers[index] = new this.$createjs.Container()
      this.optionContainers[index].bgImage = bgImage
    },
    setOptionContainers () {
      for (let i = 0; i < this.optionContainers.length; i++) {
        this.setOptionContainer(i)
      }
    },
    setOptionContainer (index) {
      let _container = this.optionContainers[index]
      _container.removeAllChildren()
      let _optionBg = new this.$createjs.Bitmap(
        this.queue.getResult(_container.bgImage)
      )
      _container.x = this.defaultCanvasWidth - _optionBg.image.width * 1.2
      _container.y = this.defaultCanvasHeight - _optionBg.image.height * (3 - index) * 1.2
      _container.addChild(_optionBg)
      let _option = this.getCurrentOption(index)
      if (_option.valueType === 'text') {
        let _answerText = new this.$createjs.Text(_option.value, 'bold 65px Georgia', '#fff')
        _answerText.x = _optionBg.image.width * 2 / 3
        _answerText.y = _optionBg.image.height * 2 / 5
        _answerText.set({
          textAlign: "center",
          textBaseline: "middle"
        })
        _container.addChild(_answerText)
      } else {
        let _answerImg = new this.$createjs.Bitmap(
          this.queue.getResult(_option.value)
        )

        let _ratio = _optionBg.image.height / _answerImg.image.height

        _answerImg.x = _optionBg.image.width * 2 / 3
        _answerImg.y = _ratio * _optionBg.image.height * 0.05
        _answerImg.regX = _answerImg.image.width / 2
        
        _answerImg.scaleX = _ratio * 0.9
        _answerImg.scaleY = _ratio * 0.9
        _container.addChild(_answerImg)
      }
      _container.correct = this.getCurrentOptionCorrect(index)
      _container.addEventListener("click", (event) => {
        if (this.gameReady && this.userInteraction) {
          this.userInteraction = false
          if (event.target.parent.correct) {
            this.iconCheck.alpha = 1
            this.addScore()
          } else {
            this.iconCross.alpha = 1
            this.deduceLife()
          }
          this.nextQuestion()
        }
      })
      this.stage.addChild(_container)
    },
    tick (event) {
      var deltaS = event.delta / 1000
      this.stage.update(event)
    },
    showAnswerArea () {
      this.gameReady = true
      this.iconCheck.alpha = 0
      this.iconCross.alpha = 0
      this.userInteraction = true
      this.setCurrentQuestion()
      this.setOptionContainers()
    },
    nextQuestion () {
      if (this.noOfLifeRemained > 0) {
        setTimeout(() => {
          this.currentQuestionIndex++
          if (this.currentQuestionIndex === this.questions.length) {
            this.currentQuestionIndex = 0
          }
          this.showAnswerArea()
        }, this.waitForNext)
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
