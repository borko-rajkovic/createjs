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
        {id: 'option3BgImg', src: 'statics/game/ninjariver/button3.png'},
        {id: 'logSprites', src: 'statics/game/ninjariver/log.png'},
        {id: 'heroSprites', src: 'statics/game/ninjariver/hero.png'},
        {id: 'riverSprites', src: 'statics/game/ninjariver/river-sprite-4x4.png'}
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

      var riverSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [ 
          this.queue.getResult("riverSprites")
          ],
        frames: { width: 551, height: 238 },
        animations: { flow: [0, 15] }
      });

      var logSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [ 
          this.queue.getResult("logSprites")
          ],
        frames: { width: 200, height: 90, count: 32 },
        animations: { 
          float: [0, 15], 
          dive: [24, 29, "withHero"], 
          // withHero: [16, 21, "dive"] 
          withHero: [16, 21] 
          }
      });

      var heroSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [ 
          this.queue.getResult("heroSprites")
          ],
        frames: { width: 202, height: 180, count: 18 },        
        animations: { 
          preJump: [0, 1], 
          rightJump: [2, 2], 
          leftJump: [3, 3],
          midJump: [4, 4],
          postJump: [5, 5],
          panicMovements: [6, 11],
          afterLogSinking: [12, 17]
          }
      });

      this.river = new this.$createjs.Sprite(riverSpriteSheet, "flow");

      this.logFloat1 = new this.$createjs.Sprite(logSpriteSheet, "float");
      this.logFloat2 = new this.$createjs.Sprite(logSpriteSheet, "float");
      this.logFloat3 = new this.$createjs.Sprite(logSpriteSheet, "float");
      this.logFloat4 = new this.$createjs.Sprite(logSpriteSheet, "float");
      this.logFloat5 = new this.$createjs.Sprite(logSpriteSheet, "float");
      this.logFloat6 = new this.$createjs.Sprite(logSpriteSheet, "float");
      this.logWithHero = new this.$createjs.Sprite(logSpriteSheet, "withHero");

      this.heroPreJump = new this.$createjs.Sprite(heroSpriteSheet, "preJump")
      this.heroRightJump = new this.$createjs.Sprite(heroSpriteSheet, "rightJump")
      this.heroLeftJump = new this.$createjs.Sprite(heroSpriteSheet, "leftJump")
      this.heroMidJump = new this.$createjs.Sprite(heroSpriteSheet, "midJump")
      this.heroPostJump = new this.$createjs.Sprite(heroSpriteSheet, "postJump")
      this.heroPanicMovements = new this.$createjs.Sprite(heroSpriteSheet, "panicMovements")
      this.heroAfterLogSinking = new this.$createjs.Sprite(heroSpriteSheet, "afterLogSinking")
      
      this.river.setTransform(0, 180, 1.85, 4);

      this.logFloat1.setTransform(this.defaultCanvasWidth - 700, this.defaultCanvasHeight - 300);
      this.logFloat2.setTransform(200, this.defaultCanvasHeight - 350);
      this.logFloat3.setTransform(this.defaultCanvasWidth/3, this.defaultCanvasHeight - 450);
      this.logFloat4.setTransform(600, this.defaultCanvasHeight - 650);
      this.logFloat5.setTransform(-50, this.defaultCanvasHeight - 800);
      this.logFloat6.setTransform(this.defaultCanvasWidth - 500, 150);
      this.logWithHero.setTransform(this.defaultCanvasWidth/3-50, this.defaultCanvasHeight - 90);

      this.heroPreJump.setTransform(this.defaultCanvasWidth/3-50, this.defaultCanvasHeight - 120 - 90);
      this.heroRightJump.setTransform(300, 300);
      this.heroLeftJump.setTransform(300, 300);
      this.heroMidJump.setTransform(300, 300);
      this.heroPostJump.setTransform(300, 300);
      this.heroPanicMovements.setTransform(300, 300);
      this.heroAfterLogSinking.setTransform(300, 300);      
      this.heroAfterLogSinking.setTransform(300, 300);

      this.stage.addChild(
        this.river,
        this.logFloat1,
        this.logFloat2,
        this.logFloat3,
        this.logFloat4,
        this.logFloat5,
        this.logFloat6,
        this.logWithHero,
        this.heroPreJump,
        // this.heroRightJump,
        // this.heroLeftJump,
        // this.heroMidJump,
        // this.heroPostJump,
        // this.heroPanicMovements,
        // this.heroAfterLogSinking,
      );

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
            this.addScore()
          } else {
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
