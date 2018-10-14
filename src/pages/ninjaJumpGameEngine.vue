<template>
  <div style="display: inline-block;">
    <canvas ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script>
// TODO add timer after you finish the game

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
        { id: 'lavaSprites', src: 'statics/game/ninjajump/lava.png' },
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
        images: [this.queue.getResult('ninja')],
        frames: { width: 170, height: 182, count: 21 },
        animations: {
          preJump: [0, 0],
          midJump: [1, 2, 'midJump', 0.6],
          rightJump: [7, 8, 'rightJump', 0.6],
          leftJump: [14, 15, 'leftJump', 0.6],
          postJump: [3, 6, 'preJump', 0.6]
        }
      });

      this.answerBoxSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [this.queue.getResult('answerBox')],
        frames: { width: 111, height: 70 },
        animations: { show: [0, 0] }
      });

      this.platformLeftSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [this.queue.getResult('platformLeft')],
        frames: { width: 296, height: 84 },
        animations: { show: [0, 0] }
      });

      this.platformMiddleSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [this.queue.getResult('platformMiddle')],
        frames: { width: 265, height: 106 },
        animations: { show: [0, 0] }
      });

      this.platformRightSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [this.queue.getResult('platformRight')],
        frames: { width: 219, height: 86 },
        animations: { show: [0, 0] }
      });

      var lavaSingleSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [this.queue.getResult('lavaSprites')],
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
        images: [this.queue.getResult('bgWall')],
        frames: { width: 1024, height: 1668 },
        animations: { show: [0, 0] }
      });

      var bgTextureSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [this.queue.getResult('bgTexture')],
        frames: { width: 1024, height: 1668 },
        animations: { show: [0, 0] }
      });

      this.lava = new this.$createjs.Sprite(lavaSpriteSheet, 'float');
      this.bgWall = new this.$createjs.Sprite(bgWallSpriteSheet, 'show');
      this.bgTexture = new this.$createjs.Sprite(bgTextureSpriteSheet, 'show');

      this.platformLeft = new this.$createjs.Sprite(
        this.platformLeftSpriteSheet,
        'platformLeft'
      );
      this.platformMiddle = new this.$createjs.Sprite(
        this.platformMiddleSpriteSheet,
        'platformMiddle'
      );
      this.platformRight = new this.$createjs.Sprite(
        this.platformRightSpriteSheet,
        'platformRight'
      );
      this.platformWithNinja = new this.$createjs.Sprite(
        this.platformRightSpriteSheet,
        'platformLeft'
      );

      this.answerBoxLeft = new this.$createjs.Sprite(
        this.answerBoxSpriteSheet,
        'show'
      );
      this.answerBoxMiddle = new this.$createjs.Sprite(
        this.answerBoxSpriteSheet,
        'show'
      );
      this.answerBoxRight = new this.$createjs.Sprite(
        this.answerBoxSpriteSheet,
        'show'
      );

      this.ninja = new this.$createjs.Sprite(ninjaSpriteSheet, 'preJump');

      // Alfred - add function to handle event after animation end

      this.scene = new this.$createjs.Container();

      var mask = new this.$createjs.Shape();
      mask.graphics.f('#f00').dr(0, 170, 1024, 1024);
      this.scene.mask = mask;

      this.stage.addChild(this.scene);

      this.gameStart();
      this.setAnswerBox();
    },
    // Alfred - Add function to restart
    restart() {
      this.ninjaIsDead = false;
      if (this.answerBoxLeft) this.answerBoxLeft.visible = true;
      if (this.answerBoxMiddle) this.answerBoxMiddle.visible = true;
      if (this.answerBoxRight) this.answerBoxRight.visible = true;
      this.startTimer();
      this.scene.removeAllChildren();

      this.ninja.removeAllEventListeners();
      this.ninja.addEventListener('animationend', event => {
        this.handleAnimationEnd();
      });

      this.platformLeft.setTransform(80, this.defaultCanvasHeight - 520);

      this.platformMiddle.setTransform(
        this.defaultCanvasWidth / 3 - 50,
        this.defaultCanvasHeight - 700
      );

      this.platformRight.setTransform(
        this.defaultCanvasWidth - 660,
        this.defaultCanvasHeight - 520
      );

      this.platformWithNinja.setTransform(
        this.defaultCanvasWidth / 3 - 50,
        this.defaultCanvasHeight - 250
      );

      this.lava.setTransform(0, 850);
      this.bgWall.setTransform(0, 0);
      this.bgTexture.setTransform(0, 0);

      this.ninja.setTransform(
        this.defaultCanvasWidth / 3,
        this.defaultCanvasHeight - 404
      );

      this.ninjaXOrigin = this.ninja.x;
      this.ninjaYOrigin = this.ninja.y;

      this.platformXOrigin = this.platformWithNinja.x;
      this.platformYOrigin = this.platformWithNinja.y;

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

      this.ninja.gotoAndPlay('preJump');

      this.scene.addChild(
        this.bgTexture,
        this.lava,
        this.bgWall,
        this.platformLeft,
        this.platformMiddle,
        this.platformRight,
        this.platformWithNinja,
        this.ninja,
        this.answerBoxLeft,
        this.answerBoxMiddle,
        this.answerBoxRight
      );

      this.ninjaX = this.ninja.x;
      this.ninjaY = this.ninja.y;
    },
    handleAnimationEnd() {
      if (
        this.ninja.currentAnimation === 'postJump' &&
        this.ninjaIsDead === true
      ) {
        this.deduceLife();
      }

      if (
        this.ninja.currentAnimation === 'postJump' &&
        this.ninjaShouldContinue === true && this.ninjaIsDead === false
      ) {
        this.ninjaShouldContinue === false;

        this.$createjs.Tween.get(this.ninja).to(
          { x: this.ninjaXOrigin, y: this.ninjaYOrigin },
          1500,
          createjs.Ease.circOut
        );

        this.$createjs.Tween.get(this.platformSelected).to(
          { x: this.platformXOrigin, y: this.platformYOrigin },
          1500,
          createjs.Ease.circOut
        );

        let hidePlatformWithNinja = this.$createjs.Tween.get(
          this.platformWithNinja
        ).to(
          { x: this.platformWithNinja.x + 1000, y: this.platformWithNinja.y },
          1500,
          createjs.Ease.circOut
        );

        // Borko: switch platform on which ninja is standing with selected platform
        let temp = this.platformWithNinja;
        this.platformWithNinja = this.platformSelected;
        this.platformSelected = temp;

        // Borko: return pointer to correct platform
        switch (this.selectedIndex) {
          case 0:
            this.platformLeft = new this.$createjs.Sprite(
              this.platformLeftSpriteSheet,
              'platformLeft'
            );
            this.platformLeft.setTransform(80, this.defaultCanvasHeight - 520);
            this.platformSelected = this.platformLeft;
            break;
          case 1:
            this.platformMiddle = new this.$createjs.Sprite(
              this.platformMiddleSpriteSheet,
              'platformMiddle'
            );

            this.platformMiddle.setTransform(
              this.defaultCanvasWidth / 3 - 50,
              this.defaultCanvasHeight - 700
            );

            this.platformSelected = this.platformMiddle;
            break;
          case 2:
            this.platformRight = new this.$createjs.Sprite(
              this.platformRightSpriteSheet,
              'platformRight'
            );
            this.platformRight.setTransform(
              this.defaultCanvasWidth - 660,
              this.defaultCanvasHeight - 520
            );

            this.platformSelected = this.platformRight;
            break;
        }

        this.platformSelected.setTransform(this.platformSelectedX, -500);
        this.scene.addChild(
          this.platformLeft,
          this.platformMiddle,
          this.platformRight
        );

        this.$createjs.Tween.get(this.platformSelected).to(
          { x: this.platformSelectedX, y: this.platformSelectedY },
          1500,
          createjs.Ease.circOut
        );

        hidePlatformWithNinja.addEventListener('complete', () => {
          this.ninja.gotoAndPlay('preJump');
          console.log('Finished movement of the ninja');

          this.answerBoxLeft.visible = true;
          this.answerBoxMiddle.visible = true;
          this.answerBoxRight.visible = true;

          this.nextQuestion();
        });
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
          this.jumpToPlatform(
            index,
            this.noOfLifeRemained <= 1 && !event.target.parent.correct
          );
          if (event.target.parent.correct) {
            this.addScore();
          } else {
            if (this.noOfLifeRemained > 1) this.deduceLife();
          }
        }
      });
      this.stage.addChild(_container);
    },
    jumpToPlatform(index, gameLost) {
      console.log('Jump to platform', index, gameLost);
      this.selectedIndex = index;
      var xDiff = this.ninja.x - this.platformWithNinja.x;
      var yDiff = this.ninja.y - this.platformWithNinja.y;

      switch (index) {
        case 0:
          this.ninja.gotoAndPlay('leftJump');
          this.ninjaX = this.platformLeft.x + xDiff;
          this.ninjaY = this.platformLeft.y + yDiff;
          this.platformSelected = this.platformLeft;
          this.platformSelectedX = this.platformLeft.x;
          this.platformSelectedY = this.platformLeft.y;
          this.selectedAnswerBox = this.answerBoxLeft;
          this.selectedAnswerBoxText = this.answerBoxTextLeft;
          break;
        case 1:
          this.ninja.gotoAndPlay('midJump');
          this.ninjaX = this.platformMiddle.x + xDiff;
          this.ninjaY = this.platformMiddle.y + yDiff;
          this.platformSelected = this.platformMiddle;
          this.platformSelectedX = this.platformMiddle.x;
          this.platformSelectedY = this.platformMiddle.y;
          this.selectedAnswerBox = this.answerBoxMiddle;
          this.selectedAnswerBoxText = this.answerBoxTextMiddle;
          break;
        case 2:
          this.ninja.gotoAndPlay('rightJump');
          this.ninjaX = this.platformRight.x + xDiff;
          this.ninjaY = this.platformRight.y + yDiff;
          this.platformSelected = this.platformRight;
          this.platformSelectedX = this.platformRight.x;
          this.platformSelectedY = this.platformRight.y;
          this.selectedAnswerBox = this.answerBoxRight;
          this.selectedAnswerBoxText = this.answerBoxTextRight;
          break;
        default:
          break;
      }

      this.selectedAnswerBox.visible = false;
      this.selectedAnswerBoxText.visible = false;

      let moveToPlatform = this.$createjs.Tween.get(this.ninja).to(
        { x: this.ninjaX, y: this.ninjaY },
        500,
        createjs.Ease.circOut
      );

      moveToPlatform.addEventListener('complete', () => {
        console.log('Complete tween');
        this.ninja.gotoAndPlay('postJump');
        if (!gameLost) {
          this.clearAnswerBox();
          this.ninjaContinues(index);
        } else {
          this.ninjaDies(index);
        }
      });
    },
    ninjaContinues(index) {
      this.answerBoxLeft.visible = false;
      this.answerBoxMiddle.visible = false;
      this.answerBoxRight.visible = false;

      this.ninjaShouldContinue = true;
    },
    ninjaDies(index) {
      this.ninjaIsDead = true;
    },
    tick(event) {
      var deltaS = event.delta / 1000;

      this.stage.update(event);
    },
    showAnswerArea() {
      // Alfred - call the restart function when play or replay button is clicked
      this.restart();
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
