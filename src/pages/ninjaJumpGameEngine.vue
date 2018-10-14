<template>
  <div style="display: inline-block;">
    <canvas ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script>
// TODO statics/game/ninjajump/ninja.png

// TODO add timer after you finish the game
// TODO For the sprite images, please resize them to integer value. For example, if the sprite is 3 x 3, the dimension must be multiple of 3. Otherwise, it could not be shown properly.

import GameShellMixin from '../library/mixins/gameShell';
export default {
  name: 'ninja-jump-game-engine',
  mixins: [GameShellMixin],
  data() {
    return {
      optionContainers: [],
      noOfOptionContainer: 3,
      iconCheck: null,
      iconCross: null,
      waitForNext: 200,
      showTimer: true
    };
  },
  methods: {
    init() {
      this.gameShellInit();

      this.queue = new this.$createjs.LoadQueue();
      this.queue.on('complete', this.handleComplete, this);
      let manifest = this.gameShellManifest.concat([
        { id: 'option1BgImg', src: 'statics/game/ninjajump/button1.png' },
        { id: 'option2BgImg', src: 'statics/game/ninjajump/button2.png' },
        { id: 'option3BgImg', src: 'statics/game/ninjajump/button3.png' },
        { id: 'logSprites', src: 'statics/game/ninjariver/log.png' },
        { id: 'lavaSprites', src: 'statics/game/ninjajump/lava.png' },
        { id: 'heroSprites', src: 'statics/game/ninjariver/hero.png' },
        {
          id: 'lavaSprite1',
          src: 'statics/game/ninjajump/lava-separated/lava-01.png'
        },
        {
          id: 'lavaSprite2',
          src: 'statics/game/ninjajump/lava-separated/lava-02.png'
        },
        {
          id: 'lavaSprite3',
          src: 'statics/game/ninjajump/lava-separated/lava-03.png'
        },
        {
          id: 'lavaSprite4',
          src: 'statics/game/ninjajump/lava-separated/lava-04.png'
        },
        {
          id: 'lavaSprite5',
          src: 'statics/game/ninjajump/lava-separated/lava-05.png'
        },
        {
          id: 'lavaSprite6',
          src: 'statics/game/ninjajump/lava-separated/lava-06.png'
        },
        {
          id: 'lavaSprite7',
          src: 'statics/game/ninjajump/lava-separated/lava-07.png'
        },
        {
          id: 'lavaSprite8',
          src: 'statics/game/ninjajump/lava-separated/lava-08.png'
        },
        {
          id: 'lavaSprite9',
          src: 'statics/game/ninjajump/lava-separated/lava-09.png'
        },
        {
          id: 'lavaSprite10',
          src: 'statics/game/ninjajump/lava-separated/lava-10.png'
        },
        {
          id: 'lavaSprite11',
          src: 'statics/game/ninjajump/lava-separated/lava-11.png'
        },
        {
          id: 'lavaSprite12',
          src: 'statics/game/ninjajump/lava-separated/lava-12.png'
        },
        {
          id: 'lavaSprite13',
          src: 'statics/game/ninjajump/lava-separated/lava-13.png'
        },
        {
          id: 'lavaSprite14',
          src: 'statics/game/ninjajump/lava-separated/lava-14.png'
        },
        {
          id: 'bgWall',
          src: 'statics/game/ninjajump/bg-wall.png'
        },
        {
          id: 'bgTexture',
          src: 'statics/game/ninjajump/bg-texture.png'
        },
        {
          id: 'platformLeft',
          src: 'statics/game/ninjajump/platform-1.png'
        },
        {
          id: 'platformMiddle',
          src: 'statics/game/ninjajump/platform-2.png'
        },
        {
          id: 'platformRight',
          src: 'statics/game/ninjajump/platform-3.png'
        },
        {
          id: 'answerBox',
          src: 'statics/game/ninjajump/answer-box.png'
        },
        {
          id: 'ninja',
          src: 'statics/game/ninjajump/ninja.png'
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

      var ninjaSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [
          this.queue.getResult('ninja')
          ],
        frames: { width: 170, height: 182, count: 21 },
        animations: {
          preJump: [0, 0],
          midJump: [1, 2, "midJump", 0.1],
          rightJump: [7, 8, "rightJump", 0.1],
          leftJump: [14, 15, "leftJump", 0.1],
          postJump: [3, 6, "postJump", 0.1]
        }
      });

      this.answerBoxSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [
          this.queue.getResult('answerBox')
          ],
        frames: { width: 111, height: 70 },
        animations: { show: [0, 0] }
      });

      var platformLeftSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [
          this.queue.getResult('platformLeft')
          ],
        frames: { width: 296, height: 84 },
        animations: { show: [0, 0] }
      });

      var platformMiddleSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [
          this.queue.getResult('platformMiddle')
          ],
        frames: { width: 265, height: 106 },
        animations: { show: [0, 0] }
      });

      var platformRightSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [
          this.queue.getResult('platformRight')
          ],
        frames: { width: 219, height: 86 },
        animations: { show: [0, 0] }
      });

      var lavaSingleSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [
          this.queue.getResult('lavaSprites'),
          ],
        frames: { width: 1022, height: 560, spacing: 1, margin: 1 },
        animations: { flow: [0, 13] }
      });

      var lavaSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [
          this.queue.getResult('lavaSprite1'),
          this.queue.getResult('lavaSprite2'),
          this.queue.getResult('lavaSprite3'),
          this.queue.getResult('lavaSprite4'),
          this.queue.getResult('lavaSprite5'),
          this.queue.getResult('lavaSprite6'),
          this.queue.getResult('lavaSprite7'),
          this.queue.getResult('lavaSprite8'),
          this.queue.getResult('lavaSprite9'),
          this.queue.getResult('lavaSprite10'),
          this.queue.getResult('lavaSprite11'),
          this.queue.getResult('lavaSprite12'),
          this.queue.getResult('lavaSprite13'),
          this.queue.getResult('lavaSprite14')
          ],
        frames: { width: 1024, height: 560 },
        animations: { flow: [0, 13] }
      });

      var bgWallSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [
          this.queue.getResult('bgWall'),
          ],
        frames: { width: 1024, height: 1668 },
        animations: { show: [0, 0] }
      });


      var bgTextureSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [
          this.queue.getResult("bgTexture")
          ],
        frames: { width: 1024, height: 1668 },
        animations: { show: [0, 0] }
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

      this.lava = new this.$createjs.Sprite(lavaSpriteSheet, 'float');
      this.bgWall = new this.$createjs.Sprite(bgWallSpriteSheet, 'show');
      this.bgTexture = new this.$createjs.Sprite(bgTextureSpriteSheet, 'show');

      this.platformLeft = new this.$createjs.Sprite(platformLeftSpriteSheet, 'platformLeft');
      this.platformMiddle = new this.$createjs.Sprite(platformMiddleSpriteSheet, 'platformMiddle');
      this.platformRight = new this.$createjs.Sprite(platformRightSpriteSheet, 'platformRight');
      this.platformWithHero = new this.$createjs.Sprite(platformRightSpriteSheet, 'platformLeft');


      this.answerBoxLeft = new this.$createjs.Sprite(this.answerBoxSpriteSheet, 'show');
      this.answerBoxMiddle = new this.$createjs.Sprite(this.answerBoxSpriteSheet, 'show');
      this.answerBoxRight = new this.$createjs.Sprite(this.answerBoxSpriteSheet, 'show');

      this.logFloat1 = new this.$createjs.Sprite(logSpriteSheet, 'float');
      this.logFloat2 = new this.$createjs.Sprite(logSpriteSheet, 'float');
      this.logFloat3 = new this.$createjs.Sprite(logSpriteSheet, 'float');
      this.logWithHero = new this.$createjs.Sprite(logSpriteSheet, 'withHero');

      this.hero = new this.$createjs.Sprite(heroSpriteSheet, 'preJump');
      this.ninja = new this.$createjs.Sprite(ninjaSpriteSheet, 'preJump');

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
      this.startTimer();
      this.scene.removeAllChildren()
      this.hero.removeAllEventListeners();
      this.hero.addEventListener('animationend', event => {
        this.handleAnimationEnd();
      });

      this.platformLeft.setTransform(
        80,
        this.defaultCanvasHeight - 520
      );

      this.platformMiddle.setTransform(
        this.defaultCanvasWidth / 3 - 50,
        this.defaultCanvasHeight - 700
      );

      this.platformRight.setTransform(
        this.defaultCanvasWidth - 660,
        this.defaultCanvasHeight - 520
      );

      this.platformWithHero.setTransform(
        this.defaultCanvasWidth / 3 - 50,
        this.defaultCanvasHeight - 250
      );


      this.logFloat1.setTransform(
        this.defaultCanvasWidth - 700,
        this.defaultCanvasHeight - 300 - 400
      );
      
      this.logFloat2.setTransform(200, this.defaultCanvasHeight - 350 - 400);
      this.logFloat3.setTransform(
        this.defaultCanvasWidth / 3,
        this.defaultCanvasHeight - 450 - 400
      );
      this.logWithHero.setTransform(
        this.defaultCanvasWidth / 3 - 50,
        this.defaultCanvasHeight - 90 - 90 - 400
      );
      this.lava.setTransform(
        0,
        850
      );
      this.bgWall.setTransform(
        0,
        0
      );
      this.bgTexture.setTransform(
        0,
        0
      );
      this.logXOrigin = this.logWithHero.x;
      this.logYOrigin = this.logWithHero.y;

      this.hero.setTransform(
        this.defaultCanvasWidth / 3 - 50,
        this.defaultCanvasHeight - 380
      );

      this.ninja.setTransform(
        this.defaultCanvasWidth / 3,
        this.defaultCanvasHeight - 404
      );

      // this.ninja.gotoAndPlay("preJump");
      // this.ninja.gotoAndPlay("midJump");
      // this.ninja.gotoAndPlay("rightJump");
      // this.ninja.gotoAndPlay("leftJump");
      // this.ninja.gotoAndPlay("postJump");

      this.answerBoxLeft.setTransform(
        this.platformLeft.x + 180 / 2,
        this.defaultCanvasHeight - 600
      );

      this.answerBoxMiddle.setTransform(
        this.platformMiddle.x + 140 / 2,
        this.defaultCanvasHeight - 780
      );

      this.answerBoxRight.setTransform(
        this.platformRight.x + 100 / 2,
        this.defaultCanvasHeight - 600
      );


      this.logFloat1.gotoAndPlay('float')
      this.logFloat2.gotoAndPlay('float')
      this.logFloat3.gotoAndPlay('float')
      this.hero.gotoAndPlay('preJump')

      this.scene.addChild(
        this.bgTexture,
        this.lava,
        this.bgWall,
        // this.logFloat1,
        // this.logFloat2,
        // this.logFloat3,
        // this.logWithHero,
        this.platformLeft,
        this.platformMiddle,
        this.platformRight,
        this.platformWithHero,
        // this.hero,
        this.ninja,
        this.answerBoxLeft,
        this.answerBoxMiddle,
        this.answerBoxRight
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
      this.answerBoxTextLeft = new this.$createjs.Text(
        this.getCurrentOption(0).value,
        this.defaultCanvasWidth / 30 + 'px Comic Sans MS',
        '#000'
      );
      this.answerBoxTextLeft.x = this.answerBoxLeft.x + 110 / 2;
      this.answerBoxTextLeft.y = this.answerBoxLeft.y + 90 / 2 - 10;
      this.answerBoxTextLeft.width = 110;
      this.answerBoxTextLeft.height = 90;
      this.answerBoxTextLeft.set({
        textAlign: 'center',
        textBaseline: 'middle'
      });

      this.answerBoxTextMiddle = new this.$createjs.Text(
        this.getCurrentOption(1).value,
        this.defaultCanvasWidth / 30 + 'px Comic Sans MS',
        '#000'
      );
      this.answerBoxTextMiddle.x = this.answerBoxMiddle.x + 110 / 2;
      this.answerBoxTextMiddle.y = this.answerBoxMiddle.y + 90 / 2 - 10;
      this.answerBoxTextMiddle.width = 110;
      this.answerBoxTextMiddle.height = 90;
      this.answerBoxTextMiddle.set({
        textAlign: 'center',
        textBaseline: 'middle'
      });

      this.answerBoxTextRight = new this.$createjs.Text(
        this.getCurrentOption(2).value,
        this.defaultCanvasWidth / 30 + 'px Comic Sans MS',
        '#000'
      );
      this.answerBoxTextRight.x = this.answerBoxRight.x + 110 / 2;
      this.answerBoxTextRight.y = this.answerBoxRight.y + 90 / 2 - 10;
      this.answerBoxTextRight.width = 110;
      this.answerBoxTextRight.height = 90;
      this.answerBoxTextRight.set({
        textAlign: 'center',
        textBaseline: 'middle'
      });

      this.scene.addChild(
        this.answerBoxTextLeft,
        this.answerBoxTextMiddle,
        this.answerBoxTextRight
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
        this.answerBoxTextLeft,
        this.answerBoxTextMiddle,
        this.answerBoxTextRight
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
          this.jumpToLog(index, this.noOfLifeRemained <= 1 && !event.target.parent.correct);
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
