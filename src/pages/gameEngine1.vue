<template>
  <div style="display: inline-block;">
    <canvas ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script>
import GameShellMixin from '../library/mixins/gameShell';
export default {
  name: 'game-engine1',
  mixins: [GameShellMixin],
  data() {
    return {
      optionContainers: [],
      noOfOptionContainer: 3,
      iconCheck: null,
      iconCross: null,
      waitForNext: 200
    };
  },
  methods: {
    init() {
      this.gameShellInit();

      this.queue = new this.$createjs.LoadQueue();
      this.queue.on('complete', this.handleComplete, this);
      let manifest = this.gameShellManifest.concat([
        { id: 'option1BgImg', src: 'statics/game/ninjariver/button1.png' },
        { id: 'option2BgImg', src: 'statics/game/ninjariver/button2.png' },
        { id: 'option3BgImg', src: 'statics/game/ninjariver/button3.png' },
        { id: 'logSprites', src: 'statics/game/ninjariver/log.png' },
        { id: 'heroSprites', src: 'statics/game/ninjariver/hero.png' },
        {
          id: 'riverSprites',
          src: 'statics/game/ninjariver/river-sprite-4x4.png'
        }
      ]);
      manifest = manifest.concat(this.getImageFromQuestion());
      this.queue.loadManifest(manifest);
    },
    handleComplete() {
      this.initGameValues();
      this.setGameShell();
      this.$createjs.Ticker.timingMode = this.$createjs.Ticker.RAF;

      // place option buttons
      this.createOptionContainer(0, 'option1BgImg');
      this.createOptionContainer(1, 'option2BgImg');
      this.createOptionContainer(2, 'option3BgImg');

      var riverSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [this.queue.getResult('riverSprites')],
        frames: { width: 551, height: 238 },
        animations: { flow: [0, 15] }
      });

      var logSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [this.queue.getResult('logSprites')],
        frames: { width: 200, height: 90, count: 32 },
        animations: {
          float: [0, 15],
          dive: [24, 29],
          withHero: [16, 21]
        }
      });

      var heroSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [this.queue.getResult('heroSprites')],
        frames: { width: 202, height: 180, count: 18 },
        animations: {
          preJump: [0, 1, 'preJump', 0.6],
          rightJump: [2, 2],
          leftJump: [3, 3],
          midJump: [4, 4],
          postJump: [5, 5],
          panicMovements: [6, 11],
          afterLogSinking: [12, 17]
        }
      });

      this.river = new this.$createjs.Sprite(riverSpriteSheet, 'flow');

      this.logFloat1 = new this.$createjs.Sprite(logSpriteSheet, 'float');
      this.logFloat2 = new this.$createjs.Sprite(logSpriteSheet, 'float');
      this.logFloat3 = new this.$createjs.Sprite(logSpriteSheet, 'float');
      this.logFloat4 = new this.$createjs.Sprite(logSpriteSheet, 'float');
      this.logFloat5 = new this.$createjs.Sprite(logSpriteSheet, 'float');
      this.logFloat6 = new this.$createjs.Sprite(logSpriteSheet, 'float');
      this.logWithHero = new this.$createjs.Sprite(logSpriteSheet, 'withHero');

      this.hero = new this.$createjs.Sprite(heroSpriteSheet, 'preJump');

      // Alfred - add function to handle event after animation end


      this.scene = new this.$createjs.Container();

      var mask = new this.$createjs.Shape();
      mask.graphics.f('#f00').dr(0, 170, 1024, 1024);
      this.scene.mask = mask;

      this.stage.addChild(this.scene);

      this.heroXOrigin = this.hero.x;
      this.heroYOrigin = this.hero.y;

      this.gameStart();
      this.setAnswerBox();
    },
    // Alfred - Add function to restart
    restart () {
      this.scene.removeAllChildren()
      this.hero.removeAllEventListeners();
      this.hero.addEventListener('animationend', event => {
        this.handleAnimationEnd();
      });

      this.river.setTransform(0, 170, 2, 4);

      this.logFloat1.setTransform(
        this.defaultCanvasWidth - 700,
        this.defaultCanvasHeight - 300
      );
      
      this.logFloat2.setTransform(200, this.defaultCanvasHeight - 350);
      this.logFloat3.setTransform(
        this.defaultCanvasWidth / 3,
        this.defaultCanvasHeight - 450
      );
      this.logFloat4.setTransform(600, this.defaultCanvasHeight - 650);
      this.logFloat5.setTransform(-50, this.defaultCanvasHeight - 800);
      this.logFloat6.setTransform(this.defaultCanvasWidth - 500, 150);
      this.logWithHero.setTransform(
        this.defaultCanvasWidth / 3 - 50,
        this.defaultCanvasHeight - 90
      );
      this.logXOrigin = this.logWithHero.x;
      this.logYOrigin = this.logWithHero.y;

      this.hero.setTransform(
        this.defaultCanvasWidth / 3 - 50,
        this.defaultCanvasHeight - 120 - 90
      );

      this.logFloat1.gotoAndPlay('float')
      this.logFloat2.gotoAndPlay('float')
      this.logFloat3.gotoAndPlay('float')
      this.logFloat4.gotoAndPlay('float')
      this.logFloat5.gotoAndPlay('float')
      this.logFloat6.gotoAndPlay('float')
      this.hero.gotoAndPlay('preJump')

      this.scene.addChild(
        this.river,
        this.logFloat1,
        this.logFloat2,
        this.logFloat3,
        this.logFloat4,
        this.logFloat5,
        this.logFloat6,
        this.logWithHero,
        this.hero
      );

      
      // this.heroXOrigin = this.hero.x;
      // this.heroYOrigin = this.hero.y;

      this.heroX = this.hero.x;
      this.heroY = this.hero.y;
    },
    handleAnimationEnd() {
      if (
        this.hero.currentAnimation === 'leftJump' ||
        this.hero.currentAnimation === 'midJump' ||
        this.hero.currentAnimation === 'rightJump'
      ) {
        this.hero.gotoAndPlay('postJump');
      }
      if (this.hero.currentAnimation === 'afterLogSinking') {
        this.hero.stop();
        this.deduceLife();
      }
    },
    setAnswerBox() {
      this.answerBoxText1 = new this.$createjs.Text(
        this.getCurrentOption(0).value,
        'bold ' + this.defaultCanvasWidth / 30 + 'px Comic Sans MS',
        '#fff'
      );
      this.answerBoxText1.x = this.logFloat1.x + 200 / 2;
      this.answerBoxText1.y = this.logFloat1.y + 90 / 2 - 10;
      this.answerBoxText1.width = 200;
      this.answerBoxText1.height = 90;
      this.answerBoxText1.set({
        textAlign: 'center',
        textBaseline: 'middle'
      });

      this.answerBoxText2 = new this.$createjs.Text(
        this.getCurrentOption(1).value,
        'bold ' + this.defaultCanvasWidth / 30 + 'px Comic Sans MS',
        '#fff'
      );
      this.answerBoxText2.x = this.logFloat2.x + 200 / 2;
      this.answerBoxText2.y = this.logFloat2.y + 90 / 2 - 10;
      this.answerBoxText2.width = 200;
      this.answerBoxText2.height = 90;
      this.answerBoxText2.set({
        textAlign: 'center',
        textBaseline: 'middle'
      });

      this.answerBoxText3 = new this.$createjs.Text(
        this.getCurrentOption(2).value,
        'bold ' + this.defaultCanvasWidth / 30 + 'px Comic Sans MS',
        '#fff'
      );
      this.answerBoxText3.x = this.logFloat3.x + 200 / 2;
      this.answerBoxText3.y = this.logFloat3.y + 90 / 2 - 10;
      this.answerBoxText3.width = 200;
      this.answerBoxText3.height = 90;
      this.answerBoxText3.set({
        textAlign: 'center',
        textBaseline: 'middle'
      });

      this.scene.addChild(
        this.answerBoxText1,
        this.answerBoxText2,
        this.answerBoxText3
      );
    },
    createOptionContainer(index, bgImage) {
      this.optionContainers[index] = new this.$createjs.Container();
      this.optionContainers[index].bgImage = bgImage;
    },
    setOptionContainers() {
      for (let i = 0; i < this.optionContainers.length; i++) {
        this.setOptionContainer(i);
      }
    },
    clearAnswerBox() {
      this.scene.removeChild(
        this.answerBoxText1,
        this.answerBoxText2,
        this.answerBoxText3
      );
    },
    setOptionContainer(index) {
      this.clearAnswerBox();
      this.setAnswerBox();
      let _container = this.optionContainers[index];
      _container.removeAllChildren();
      let _optionBg = new this.$createjs.Bitmap(
        this.queue.getResult(_container.bgImage)
      );
      _container.x = this.defaultCanvasWidth - _optionBg.image.width * 1.2;
      _container.y =
        this.defaultCanvasHeight - _optionBg.image.height * (3 - index) * 1.2;
      _container.addChild(_optionBg);
      let _option = this.getCurrentOption(index);
      if (_option.valueType === 'text') {
        let _answerText = new this.$createjs.Text(
          _option.value,
          'bold 65px Georgia',
          '#fff'
        );
        _answerText.x = (_optionBg.image.width * 2) / 3;
        _answerText.y = (_optionBg.image.height * 2) / 5;
        _answerText.set({
          textAlign: 'center',
          textBaseline: 'middle'
        });
        _container.addChild(_answerText);
      } else {
        let _answerImg = new this.$createjs.Bitmap(
          this.queue.getResult(_option.value)
        );

        let _ratio = _optionBg.image.height / _answerImg.image.height;

        _answerImg.x = (_optionBg.image.width * 2) / 3;
        _answerImg.y = _ratio * _optionBg.image.height * 0.05;
        _answerImg.regX = _answerImg.image.width / 2;

        _answerImg.scaleX = _ratio * 0.9;
        _answerImg.scaleY = _ratio * 0.9;
        _container.addChild(_answerImg);
      }
      _container.correct = this.getCurrentOptionCorrect(index);
      _container.addEventListener('click', event => {
        if (this.gameReady && this.userInteraction) {
          this.userInteraction = false;
          // Alfred - no matter the answer is correct or not, the ninja would jump to that log
          this.jumpToLog(index, this.noOfLifeRemained <= 1);
          if (event.target.parent.correct) {
            this.addScore();
          } else {
            if (this.noOfLifeRemained > 1) this.deduceLife();
          }
          // Alfred - move to next question after animation completed
          // this.nextQuestion();
        }
      });
      this.stage.addChild(_container);
    },
    jumpToLog(index, gameLost) {
      console.log('Jump to log', index, gameLost);
      this.selectedLogIndex = index;
      switch (index) {
        case 0:
          // Alfred - use gotoAndPlay to change animation
          this.hero.gotoAndPlay('rightJump');
          this.heroX = this.logFloat1.x;
          this.heroY = this.logFloat1.y - 130;
          this.logSelected = this.logFloat1;
          this.logSelectedX = this.logFloat1.x;
          this.logSelectedY = this.logFloat1.y;
          break;
        case 1:
          // Alfred - use gotoAndPlay to change animation
          this.hero.gotoAndPlay('midJump');
          this.heroX = this.logFloat2.x;
          this.heroY = this.logFloat2.y - 130;
          this.logSelected = this.logFloat2;
          this.logSelectedX = this.logFloat2.x;
          this.logSelectedY = this.logFloat2.y;
          break;
        case 2:
          // Alfred - use gotoAndPlay to change animation
          this.hero.gotoAndPlay('leftJump');
          this.heroX = this.logFloat3.x;
          this.heroY = this.logFloat3.y - 130;
          this.logSelected = this.logFloat3;
          this.logSelectedX = this.logFloat3.x;
          this.logSelectedY = this.logFloat3.y;
          break;
        default:
          break;
      }

      // Alfred - use Tween to animate hero movement
      let moveToLog = this.$createjs.Tween.get(this.hero).to(
        { x: this.heroX, y: this.heroY },
        500,
        createjs.Ease.circOut
      );

      moveToLog.addEventListener('complete', () => {
        console.log('Complete tween');
        if (!gameLost) {
          this.clearAnswerBox();
          this.heroContinues(index);
        } else {
          this.heroDies(index);
        }
      });
    },
    heroContinues(index) {
      this.$createjs.Tween.get(this.hero).to(
        { x: this.heroXOrigin, y: this.heroYOrigin },
        1500,
        createjs.Ease.circOut
      );
      this.logSelected.gotoAndPlay('withHero');
      this.$createjs.Tween.get(this.logSelected).to(
        { x: this.logXOrigin, y: this.logYOrigin },
        1500,
        createjs.Ease.circOut
      );
      let hideLogWithHero = this.$createjs.Tween.get(this.logWithHero).to(
        { x: this.logWithHero.x, y: this.logWithHero.y + 1000 },
        1500,
        createjs.Ease.circOut
      );

      // Borko: switch log on which hero is standing with selected log
      let temp = this.logWithHero;
      this.logWithHero = this.logSelected;
      this.logSelected = temp;

      // Borko: return pointer to correct log
      switch (index) {
        case 0:
          this.logFloat1 = this.logSelected;
          break;
        case 1:
          this.logFloat2 = this.logSelected;
          break;
        case 2:
          this.logFloat3 = this.logSelected;
          break;
      }

      const logXOffset = index === 0 ? 5000 : index === 1 ? -5000 : 0;

      this.logSelected.setTransform(logXOffset, -1000);

      this.logSelected.gotoAndPlay('float');

      this.$createjs.Tween.get(this.logSelected).to(
        { x: this.logSelectedX, y: this.logSelectedY },
        1500,
        createjs.Ease.circOut
      );

      hideLogWithHero.addEventListener('complete', () => {
        this.hero.gotoAndPlay('preJump');
        console.log('Finished movement of the hero');
        this.nextQuestion();
      });
    },
    heroDies(index) {
      this.logSelected.gotoAndPlay('dive');
      this.hero.gotoAndPlay('panicMovements');

      this.logSelected.addEventListener('animationend', e => {
        if (e.name === 'dive'){
          this.logSelected.stop();
          this.hero.gotoAndPlay('afterLogSinking');
        }
      });
    },
    tick(event) {
      var deltaS = event.delta / 1000;

      this.stage.update(event);
    },
    showAnswerArea() {
      // Alfred - call the restart function when play or replay button is clicked
      this.restart()
      this.gameReady = true;
      this.userInteraction = true;
      this.setCurrentQuestion();
      this.setOptionContainers();
    },
    nextQuestion() {
      if (this.noOfLifeRemained > 0) {
        setTimeout(() => {
          this.currentQuestionIndex++;
          if (this.currentQuestionIndex === this.questions.length) {
            this.currentQuestionIndex = 0;
          }
          this.showAnswerArea();
        }, this.waitForNext);
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>
