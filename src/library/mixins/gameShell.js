export default {
  props: {
    questions: {
      default: () => { return [] }
    },
    noOfLife: {
      type: Number,
      default: 1
    },
    scorePerAnswer: {
      type: Number,
      default: 10
    },
    timePerQuestion: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      defaultCanvasWidth: 1384,
      defaultCanvasHeight: 1024,
      canvasWidth: 1384,
      canvasHeight: 1024,
      stage: null,
      queue: null,
      noOfLifeRemained: null,
      score: null,
      lifeIconBitmap: null,
      noOfLifeRemainedText: null,
      gameShellManifest: [
        {id: 'gameBackground', src: 'statics/game/theme2/background.png'},
        {id: 'headLine', src: 'statics/game/theme2/header-line.png'},
        {id: 'lifeIcon', src: 'statics/game/theme2/heart-icon.png'},
        {id: 'startBox', src: 'statics/game/theme2/start-game/start-box.png'},
        {id: 'startPlay', src: 'statics/game/theme2/start-game/button-play.png'},
        {id: 'gameoverBox', src: 'statics/game/theme2/game-over/game-over-box.png'},
        {id: 'gameoverRestart', src: 'statics/game/theme2/game-over/button-restart.png'},
        {id: 'gameoverText', src: 'statics/game/theme2/game-over/game-over.png'},
        {id: 'scoreBg', src: 'statics/game/theme2/score-bg.png'},
        {id: 'empty', src: 'statics/empty.png'},
        {id: 'timerBg', src: 'statics/game/theme2/timer/timer-bg.png'},
        {id: 'timerGaugeFull', src: 'statics/game/theme2/timer/timer-gauge-full.png'},
        {id: 'timerGaugeEmpty', src: 'statics/game/theme2/timer/timer-gauge-empty.png'}
      ],
      gameReady: false,
      // questions: [],
      currentQuestionIndex: 0,
      userInteraction: true,
      gameoverRestartBitmap: null,
      timeContainer: null,
      timerGaugeFull: null,
      startTime: null,
      timerFrozen: false,
      showTimer: false
    }
  },
  computed: {
    header () {
      return this.headLineBitmap
    },
    ratio () {
      return this.canvasWidth / this.defaultCanvasWidth
    }
  },
  methods: {
    freezeTimer () {
      this.timerFrozen = true
    },
    updateTimerGauge (percent) {
      let _timerGaugeWidth = 232
      this.timerGaugeFull.sourceRect = new this.$createjs.Rectangle(
        0,
        0,
        _timerGaugeWidth * percent,
        _timerGaugeWidth
      )
    },
    startTimer () {
      if (this.noOfLifeRemained > 0) {
        this.timerFrozen = false
        this.startTime = (new Date()).getTime()
        this.updateTimerGauge(1)
      }
    },
    updateTimer () {
      if (this.noOfLifeRemained > 0 && this.startTime !== null && !this.timerFrozen) {
        let _timeElasped = ((new Date()).getTime() - this.startTime) / 1000
        let _percent = Math.max(0, (this.timePerQuestion - _timeElasped) / this.timePerQuestion)
        this.updateTimerGauge(_percent)

        if (_percent === 0) {
          this.resetTimer()
          this.deduceLife()
          this.nextQuestion()
          this.showAnswerArea()
        }
      }
    },
    resetTimer () {
      this.timerFrozen = false
      this.startTime = null
      this.updateTimerGauge(1) 
    },
    gameShellInit () {
      this.stage = new this.$createjs.Stage(this.$refs['gameCanvas'])
      window.addEventListener('resize', this.resize, false)
      this.$nextTick(() => {
        this.resize()
      })
    },
    initGameValues (params) {
      this.score = 0
      if (typeof this.maxLife !== 'undefined') {
        this.noOfLifeRemained = this.maxLife
      } else {
        this.noOfLifeRemained = this.noOfLife
      }
      // this.speed = 2
    },
    setGameShell (params) {
      let gameBackground = this.queue.getResult("gameBackground")
      let gameBackgroundBitmap = new this.$createjs.Bitmap(gameBackground)
      let gameBackgroundBitmapWidth = gameBackgroundBitmap.getBounds().width
      let gameBackgroundBitmapHeight = gameBackgroundBitmap.getBounds().height
      gameBackgroundBitmap.scaleX = this.defaultCanvasWidth / gameBackgroundBitmapWidth
      gameBackgroundBitmap.scaleY = this.defaultCanvasHeight / gameBackgroundBitmapHeight
      this.stage.addChild(gameBackgroundBitmap)

      let headLine = this.queue.getResult("headLine")
      this.headLineBitmap = new this.$createjs.Bitmap(headLine)
      let headLineBitmapWidth = this.headLineBitmap.getBounds().width
      let headLineBitmapHeight = this.headLineBitmap.getBounds().height
      this.headLineBitmap.scaleX = this.defaultCanvasWidth / headLineBitmapWidth * 0.74
      this.headLineBitmap.scaleY = this.defaultCanvasHeight / headLineBitmapHeight * 0.05
      this.headLineBitmap.y = this.defaultCanvasHeight / 8
      this.stage.addChild(this.headLineBitmap)
      if (params && typeof params.showHeadline !== 'undefined' && params.showHeadline === false) {
        this.headLineBitmap.alpha = 0
      }

      this.timerContainer = new this.$createjs.Container()
      let timerBg = new this.$createjs.Bitmap(
        this.queue.getResult("timerBg")
      )
      let timerGaugeEmpty = new this.$createjs.Bitmap(
        this.queue.getResult('timerGaugeEmpty')
      )
      timerGaugeEmpty.x = 20
      timerGaugeEmpty.y = 100
      this.timerGaugeFull = new this.$createjs.Bitmap(
        this.queue.getResult('timerGaugeFull')
      )
      this.timerGaugeFull.x = 20
      this.timerGaugeFull.y = 100
      this.timerContainer.addChild(timerBg, timerGaugeEmpty, this.timerGaugeFull)
      this.stage.addChild(this.timerContainer)
      this.timerContainer.scaleX = 0.7
      this.timerContainer.scaleY = 0.7
      this.timerContainer.x = this.defaultCanvasWidth - this.defaultCanvasWidth / 5
      this.timerContainer.y = this.defaultCanvasHeight / 3.6
      this.timerContainer.alpha = 0

      let scoreContainer = new this.$createjs.Container()
      let scoreBg = this.queue.getResult("scoreBg")
      let scoreBgBitmap = new this.$createjs.Bitmap(scoreBg)
      let scoreBgBitmapWidth = scoreBgBitmap.getBounds().width
      let scoreBgBitmapHeight = scoreBgBitmap.getBounds().height
      scoreBgBitmap.scaleX = this.defaultCanvasWidth / scoreBgBitmapWidth * 0.18
      scoreBgBitmap.scaleY = this.defaultCanvasHeight / scoreBgBitmapHeight * 0.13
      scoreContainer.addChild(scoreBgBitmap)
      scoreContainer.x = this.defaultCanvasWidth - this.defaultCanvasWidth / 4.5
      scoreContainer.y = this.defaultCanvasHeight / 40
      this.scoreText = new this.$createjs.Text(0, ' ' + (this.defaultCanvasWidth / 20) + 'px Comic Sans MS', '#ffffff')
      this.scoreText.x = this.defaultCanvasWidth / 11
      this.scoreText.y = this.defaultCanvasWidth / 25
      this.scoreText.set({
        textAlign: "center",
        textBaseline: "middle"
      })
      scoreContainer.addChild(this.scoreText)
      this.stage.addChild(scoreContainer)

      let lifeIcon = this.queue.getResult("lifeIcon")
      this.lifeIconBitmap = new this.$createjs.Bitmap(lifeIcon)
      this.lifeIconBitmap.regX = this.lifeIconBitmap.image.width / 2
      this.lifeIconBitmap.regY = this.lifeIconBitmap.image.height / 2
      this.lifeIconBitmap.x = this.lifeIconBitmap.image.width / 4
      this.lifeIconBitmap.y = this.lifeIconBitmap.image.height / 8
      let lifeIconBitmapWidth = this.lifeIconBitmap.getBounds().width
      let lifeIconBitmapHeight = this.lifeIconBitmap.getBounds().height
      this.lifeIconBitmap.scaleX = this.defaultCanvasWidth / lifeIconBitmapWidth * 0.07
      this.lifeIconBitmap.scaleY = this.defaultCanvasHeight / lifeIconBitmapHeight * 0.08

      let lifeContainer = new this.$createjs.Container()
      lifeContainer.addChild(this.lifeIconBitmap)
      lifeContainer.x = this.defaultCanvasWidth - this.defaultCanvasWidth / 5
      lifeContainer.y = this.defaultCanvasHeight / 5

      let timesText = new this.$createjs.Text('x', ' ' + (this.defaultCanvasWidth / 20) + 'px Comic Sans MS', '#c20000')
      timesText.x = lifeIconBitmapWidth * this.lifeIconBitmap.scaleX * 1.05
      timesText.y = this.defaultCanvasHeight / -25
      lifeContainer.addChild(timesText)

      this.noOfLifeRemainedText = new this.$createjs.Text(this.noOfLifeRemained, ' ' + (this.defaultCanvasWidth / 15) + 'px Comic Sans MS', '#c20000')
      this.noOfLifeRemainedText.x = lifeIconBitmapWidth * this.lifeIconBitmap.scaleX * 1.05 + this.defaultCanvasWidth / 30
      this.noOfLifeRemainedText.y = this.defaultCanvasHeight / -20
      lifeContainer.addChild(this.noOfLifeRemainedText)

      this.stage.addChild(lifeContainer)

      this.questionArea = new this.$createjs.Container()
      this.questionArea.setBounds(this.defaultCanvasWidth / 20, this.defaultCanvasHeight / 25, this.defaultCanvasWidth / 5, this.defaultCanvasHeight / 10)
      this.questionArea.x = this.defaultCanvasWidth / 3
      this.questionArea.y = this.defaultCanvasHeight / 14
      this.question = new this.$createjs.Text('', 'bold ' + (this.defaultCanvasWidth / 25) + 'px Comic Sans MS', '#000')
      this.question.setBounds(this.defaultCanvasWidth / 20, this.defaultCanvasHeight / 25, this.defaultCanvasWidth / 5, this.defaultCanvasHeight / 10)
      this.question.set({
        textAlign: "center",
        textBaseline: "middle"
      })
      this.questionArea.addChild(this.question)
      this.stage.addChild(this.questionArea)

      this.startScreen = new this.$createjs.Container()
      let startScreenBg = new this.$createjs.Shape()
      startScreenBg.graphics.beginFill("#fff")
      startScreenBg.graphics.drawRect(0, 0, this.defaultCanvasWidth, this.defaultCanvasHeight)
      startScreenBg.alpha = 0.5
      this.startScreen.addChild(startScreenBg)

      let startBox = this.queue.getResult("startBox")
      let startBoxBitmap = new this.$createjs.Bitmap(startBox)
      let startBoxBitmapWidth = startBoxBitmap.getBounds().width
      let startBoxBitmapHeight = startBoxBitmap.getBounds().height
      startBoxBitmap.scaleX = this.defaultCanvasWidth / startBoxBitmapWidth * 0.65
      startBoxBitmap.scaleY = this.defaultCanvasHeight / startBoxBitmapHeight * 0.65
      startBoxBitmap.x = this.defaultCanvasWidth / 6
      startBoxBitmap.y = this.defaultCanvasHeight / 8
      this.startScreen.addChild(startBoxBitmap)

      let startPlay = this.queue.getResult("startPlay")
      let startPlayBitmap = new this.$createjs.Bitmap(startPlay)
      let startPlayBitmapWidth = startPlayBitmap.getBounds().width
      let startPlayBitmapHeight = startPlayBitmap.getBounds().height
      startPlayBitmap.scaleX = this.defaultCanvasWidth / startPlayBitmapWidth * 0.2
      startPlayBitmap.scaleY = this.defaultCanvasHeight / startPlayBitmapHeight * 0.25
      startPlayBitmap.x = this.defaultCanvasWidth / 2.5
      startPlayBitmap.y = this.defaultCanvasHeight / 2.2
      this.startScreen.addChild(startPlayBitmap)

      startPlayBitmap.addEventListener("click", (event) => {
        this.gameStart()
        this.$createjs.Tween.get(this.startScreen).to({alpha:0}, 300).call(this.showAnswerArea)
        this.gameReady = true
      })

      let startText = new this.$createjs.Text('Start Game', 'bold ' + (this.defaultCanvasWidth / 15) + 'px Comic Sans MS', '#000')
      startText.setBounds(this.defaultCanvasWidth / 10, this.defaultCanvasHeight / 25, this.defaultCanvasWidth / 5, this.defaultCanvasHeight / 10)
      startText.x = this.defaultCanvasWidth / 2
      startText.y = this.defaultCanvasWidth / 6
      startText.set({
        textAlign: "center",
        textBaseline: "middle"
      })
      this.startScreen.addChild(startText)
      this.stage.addChild(this.startScreen)

      this.gameoverScreen = new this.$createjs.Container()
      this.gameoverScreen.alpha = 0
      let gameoverScreenBg = new this.$createjs.Shape()
      gameoverScreenBg.graphics.beginFill("#fff")
      gameoverScreenBg.graphics.drawRect(0, 0, this.defaultCanvasWidth, this.defaultCanvasHeight)
      gameoverScreenBg.alpha = 0.5
      this.gameoverScreen.addChild(gameoverScreenBg)

      let gameoverBox = this.queue.getResult("gameoverBox")
      let gameoverBoxBitmap = new this.$createjs.Bitmap(gameoverBox)
      let gameoverBoxBitmapWidth = gameoverBoxBitmap.getBounds().width
      let gameoverBoxBitmapHeight = gameoverBoxBitmap.getBounds().height
      gameoverBoxBitmap.scaleX = this.defaultCanvasWidth / gameoverBoxBitmapWidth * 0.65
      gameoverBoxBitmap.scaleY = this.defaultCanvasHeight / gameoverBoxBitmapHeight * 0.75
      gameoverBoxBitmap.x = this.defaultCanvasWidth / 6
      gameoverBoxBitmap.y = this.defaultCanvasHeight / -20
      this.gameoverScreen.addChild(gameoverBoxBitmap)

      let gameoverText = this.queue.getResult("gameoverText")
      let gameoverTextBitmap = new this.$createjs.Bitmap(gameoverText)
      let gameoverTextBitmapWidth = gameoverTextBitmap.getBounds().width
      let gameoverTextBitmapHeight = gameoverTextBitmap.getBounds().height
      gameoverTextBitmap.scaleX = this.defaultCanvasWidth / gameoverTextBitmapWidth * 0.45
      gameoverTextBitmap.scaleY = this.defaultCanvasHeight / gameoverTextBitmapHeight * 0.3
      gameoverTextBitmap.x = this.defaultCanvasWidth / 3.8
      gameoverTextBitmap.y = this.defaultCanvasHeight / 3.3
      this.gameoverScreen.addChild(gameoverTextBitmap)

      let gameoverRestart = this.queue.getResult("gameoverRestart")
      this.gameoverRestartBitmap = new this.$createjs.Bitmap(gameoverRestart)
      let gameoverRestartBitmapWidth = this.gameoverRestartBitmap.getBounds().width
      let gameoverRestartBitmapHeight = this.gameoverRestartBitmap.getBounds().height
      this.gameoverRestartBitmap.scaleX = this.defaultCanvasWidth / gameoverRestartBitmapWidth * 0.15
      this.gameoverRestartBitmap.scaleY = this.defaultCanvasHeight / gameoverRestartBitmapHeight * 0.18
      this.gameoverRestartBitmap.x = this.defaultCanvasWidth / 2.5
      this.gameoverRestartBitmap.y = this.defaultCanvasHeight / 1.35
      this.gameoverScreen.addChild(this.gameoverRestartBitmap)

      this.gameoverRestartBitmap.addEventListener("click", (event) => {
        this.resetScore()
        this.gameStart()
        this.$createjs.Tween.get(this.gameoverScreen).to({alpha:0}, 300).call(this.showAnswerArea)
        // this.gameReady = true
      })

      this.stage.addChild(this.gameoverScreen)
    },
    gameStart () {
      console.log('game start: ' + this.showTimer)
      if (this.showTimer) {
        this.timerContainer.alpha = 1
      }
      this.initGameValues()
      this.currentQuestionIndex = 0
      this.stage.addChild(this.startScreen)

      this.noOfLifeRemainedText.text = this.noOfLifeRemained
      this.stage.update()

      this.$createjs.Ticker.addEventListener('tick', this.tick)
      this.$createjs.Ticker.addEventListener('tick', this.$createjs.Tween)
      this.currentQuestionIndex = 0
    },
    gameStop () {
      this.gameoverRestartBitmap.alpha = 0
      this.stage.addChild(this.gameoverScreen)
      this.gameReady = false
      this.$createjs.Tween.get(this.gameoverScreen).to({alpha:1}, 1500).call(this.enableRestartButton).call(this.clearTick)
    },
    enableRestartButton () {
      this.gameoverRestartBitmap.alpha = 1
      this.stage.update()
    },
    clearTick () {
      this.$createjs.Ticker.removeEventListener("tick", this.stage)
      this.$createjs.Tween.removeAllTweens()
      this.$createjs.Ticker.removeAllEventListeners()
    },
    resetScore () {
      this.score = 0
      this.scoreText.text = this.score
      this.stage.update()
    },
    addScore () {
      this.score += this.scorePerAnswer
      this.scoreText.text = this.score
    },
    deduceLife () {
      if (this.noOfLifeRemained > 0) {
        this.noOfLifeRemained--
        this.noOfLifeRemainedText.text = this.noOfLifeRemained
        let _scaleX = this.lifeIconBitmap.scaleX
        let _scaleY = this.lifeIconBitmap.scaleY
        createjs.Tween.get(this.lifeIconBitmap).to({scaleX:_scaleX * 1.3, scaleY:_scaleY * 1.3}, 200).to({scaleX:_scaleX, scaleY:_scaleY}, 100)

        if (this.noOfLifeRemained === 0) {
          this.gameStop()
          /*
          this.stage.addChild(this.gameoverScreen)
          this.$createjs.Tween.get(this.gameoverScreen).to({alpha:1}, 500).call(this.gameStop)
          */
          // send result to server
        }
      }        
    },
    getImageFromQuestion () {
      let _manifest = []
      let _imageIndex = {}
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i].answerType === 'image') {
          let _id = this.questions[i].id
          if (typeof _imageIndex[_id] === 'undefined') {
            _imageIndex[_id] = true
            _manifest.push({id: _id, src: this.questions[i].answer})
          }
        }
      }
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i]['options']) {
          for (let j = 0; j < this.questions[i]['options'].length; j++) {
            if (this.questions[i]['options'][j].valueType === 'image') {
              let _value = this.questions[i]['options'][j].value
              if (typeof _imageIndex[_value] === 'undefined') {
                _imageIndex[_value] = true
                _manifest.push({id: _value, src: _value})
              }
            }
          }
        }
      }
      return _manifest
    },
    clear () {
      if (this.stage) {
        this.stage.removeAllChildren()
        this.stage.clear()
      }
      this.$createjs.Ticker.reset()
      this.$createjs.Tween.removeAllTweens()
    },
    resize () {
      let scaleFactor= Math.min(window.innerWidth/this.defaultCanvasWidth, window.innerHeight/this.defaultCanvasHeight)
      this.canvasHeight = this.defaultCanvasHeight * scaleFactor
      this.canvasWidth = this.defaultCanvasWidth * scaleFactor
      this.stage.scaleX = scaleFactor
      this.stage.scaleY = scaleFactor
      if (this.gameResize) {
        this.gameResize(scaleFactor)
      }
      this.stage.update()
    },
    questionLoaded () {
      this.init()
      window.addEventListener('resize', this.resize, false)
      this.resize()
    },
    setCurrentQuestion () {
      if (this.questions && this.questions[this.currentQuestionIndex]) {
        this.question.text = this.questions[this.currentQuestionIndex].title
      }
    },
    getCurrentOptions () {
      if (this.questions && this.questions[this.currentQuestionIndex]) {
        return this.questions[this.currentQuestionIndex]['options']
      } else {
        return []
      }
    },
    getCurrentOptionCorrect (index) {
      if (this.getCurrentOptions()[index] && this.getCurrentOptions()[index]['correct']) {
        return true
      } else {
        return false
      }
    },
    getCurrentOption (index) {
      if (this.getCurrentOptions()[index]) {
        return this.getCurrentOptions()[index]
      } else {
        return {}
      }
    }
  },
  mounted () {
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
    this.clear()
    this.stage = null
  }
}