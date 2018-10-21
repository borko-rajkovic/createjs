<template>
  <div style="display: inline-block;">
    <canvas ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script>
import GameShellMixin from '../../library/mixins/gameShell';
export default {
  name: 'ninja-ghost-leg-game-engine',
  mixins: [GameShellMixin],
  data() {
    return {
      optionContainers: [],
      noOfOptionContainer: 3,
      waitForNext: 0
    };
  },
  methods: {
    init() {
      this.gameShellInit();

      this.queue = new this.$createjs.LoadQueue();
      this.queue.on('complete', this.handleComplete, this);
      let manifest = this.gameShellManifest.concat([
        { id: 'option1BgImg', src: 'statics/game/ninjaghostleg/button1.png' },
        { id: 'option2BgImg', src: 'statics/game/ninjaghostleg/button2.png' },
        { id: 'option3BgImg', src: 'statics/game/ninjaghostleg/button3.png' },
        {
          id: 'answerBox',
          src: 'statics/game/ninjaghostleg/answer-box.png'
        },
        {
          id: 'ninja',
          src: 'statics/game/ninjaghostleg/ninja.png'
        },
        {
          id: 'gameBackground',
          src: 'statics/game/ninjaghostleg/bg.png'
        },
        {
          id: 'pathEnd',
          src: 'statics/game/ninjaghostleg/path/end.png'
        },
        {
          id: 'pathLeft',
          src: 'statics/game/ninjaghostleg/path/left.png'
        },
        {
          id: 'pathMid',
          src: 'statics/game/ninjaghostleg/path/mid.png'
        },
        {
          id: 'pathMidLeft',
          src: 'statics/game/ninjaghostleg/path/mid-left.png'
        },
        {
          id: 'pathMidRight',
          src: 'statics/game/ninjaghostleg/path/mid-right.png'
        },
        {
          id: 'pathRight',
          src: 'statics/game/ninjaghostleg/path/right.png'
        },
        {
          id: 'pathStart',
          src: 'statics/game/ninjaghostleg/path/start.png'
        },
        {
          id: 'pathTurnMid',
          src: 'statics/game/ninjaghostleg/path/turn-mid.png'
        }
      ]);
      manifest = manifest.concat(this.getImageFromQuestion());
      this.queue.loadManifest(manifest);
    },
    createPathPiece(name){
      return new this.$createjs.Bitmap(this.queue.getResult(name));
    },
    handleComplete() {
      this.initGameValues();
      this.setGameShell();
      this.stage.removeChild(this.stage.children[1]);
      this.$createjs.Ticker.timingMode = this.$createjs.Ticker.RAF;

      // place option buttons
      this.createOptionContainer(0, 'option1BgImg');
      this.createOptionContainer(1, 'option2BgImg');
      this.createOptionContainer(2, 'option3BgImg');

      var ninjaSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [this.queue.getResult('ninja')],
        frames: { width: 142, height: 144, count: 10 },
        animations: {
          stand: [0, 0],
          moveStraight: [1, 2, 'moveStraight', 0.4],
          moveRight: [3, 4, 'moveRight', 0.4],
          moveLeft: [5, 6, 'moveLeft', 0.4],
          success: [7, 7],
          failure: [8, 8]
        }
      });

      this.answerBoxSpriteSheet = new this.$createjs.SpriteSheet({
        framerate: 10,
        images: [this.queue.getResult('answerBox')],
        frames: { width: 115, height: 66 },
        animations: { show: [0, 0] }
      });

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

      this.ninja = new this.$createjs.Sprite(ninjaSpriteSheet, 'stand');
      this.ninjaMiddle = new this.$createjs.Sprite(ninjaSpriteSheet, 'stand');
      this.ninjaRight = new this.$createjs.Sprite(ninjaSpriteSheet, 'stand');

      this.scene = new this.$createjs.Container();

      var mask = new this.$createjs.Shape();
      mask.graphics.f('#f00').dr(0, 170, 1024, 1024);
      this.scene.mask = mask;

      this.stage.addChild(this.scene);

      this.gameStart();
      this.setAnswerBox();
    },
    drawPath(ninja, pieces){
      let pieceY = ninja.y+144;
      let xOffset = ninja.x + 51;

      for (let i = 0; i < pieces.length; i++) {
        let piece;
        piece = this.createPathPiece(pieces[i]);
        piece.setTransform(xOffset, pieceY);
        this.scene.addChild(piece);
        if (pieces[i]=='pathMidRight'){
          let xOffsetMiddle = xOffset;
          const moveMiddleBy = pieces[i] == 'pathMidLeft' ? -39 : +39;
          const firstMiddlePiece = pieces[i] == 'pathMidLeft' ? 'pathLeft' : 'pathRight';
          for (let i = 0; i < 5; i++) {
            xOffsetMiddle += moveMiddleBy;
            let pieceMiddle;
            if (i==0){
              pieceMiddle = this.createPathPiece(firstMiddlePiece);
            }
            else {
              pieceMiddle = this.createPathPiece('pathTurnMid');
            }
            pieceMiddle.setTransform(xOffsetMiddle, pieceY);
            this.scene.addChild(pieceMiddle);
          }
        }
        pieceY += 39;
      }
    },
    restart() {
      this.ninjaIsDead = false;
      this.scene.removeAllChildren();

      this.ninja.removeAllEventListeners();
      this.ninja.addEventListener('animationend', event => {
        this.handleAnimationEnd();
      });

      this.ninja.setTransform(
        220 - 13,
        250
      );

      this.ninjaMiddle.setTransform(
        450 - 13,
        250
      );

      this.ninjaRight.setTransform(
        680 - 13,
        250
      );

      this.ninjaXOrigin = this.ninja.x;
      this.ninjaYOrigin = this.ninja.y;

      this.answerBoxLeft.setTransform(220, this.defaultCanvasHeight - 200);

      this.answerBoxMiddle.setTransform(450, this.defaultCanvasHeight - 200);

      this.answerBoxRight.setTransform(680, this.defaultCanvasHeight - 200);

      this.ninja.gotoAndPlay('stand');

      var shape = new this.$createjs.Shape();
      var g = shape.graphics;
      g.beginStroke("#000000");
      g.moveTo(this.ninjaMiddle.x + 142/2, this.ninjaMiddle.y + 144);
      g.lineTo(this.ninjaMiddle.x + 142/2, this.answerBoxMiddle.y);

      this.pieces = [];
      this.pathCodes = [];
      for (let i=0; i<3; i++){
        this.pieces.push([]);
        this.pieces[i].push('pathStart');
      }
      for(var i = 0; i < 9; i++){
        const pathCode =  Math.floor(Math.random() * Math.floor(4));
        this.pathCodes.push(pathCode);

        switch (pathCode) {
          case 0:
            this.pieces[0].push('pathMidRight');
            this.pieces[1].push('pathMidLeft');
            this.pieces[2].push('pathMid');
            break;
          case 1:
            this.pieces[0].push('pathMid');
            this.pieces[1].push('pathMidRight');
            this.pieces[2].push('pathMidLeft');
            break;
          default:
            this.pieces[0].push('pathMid');
            this.pieces[1].push('pathMid');
            this.pieces[2].push('pathMid');
            break;
        }
      }
      for (let i=0; i<3; i++){
        this.pieces[i].push('pathEnd');
      }

      this.drawPath(this.ninja, this.pieces[0]);
      this.drawPath(this.ninjaMiddle, this.pieces[1]);
      this.drawPath(this.ninjaRight, this.pieces[2]);

      this.scene.addChild(
        this.ninja,
        this.ninjaMiddle,
        this.ninjaRight,
        this.answerBoxLeft,
        this.answerBoxMiddle,
        this.answerBoxRight
      );

      this.ninjaX = this.ninja.x;
      this.ninjaY = this.ninja.y;
    },
    handleAnimationEnd() {
      if (
        this.ninja.currentAnimation === 'success' &&
        this.ninjaIsDead === true
      ) {
        this.deduceLife();
      }

      if (
        this.ninja.currentAnimation === 'success' &&
        this.ninjaShouldContinue === true &&
        this.ninjaIsDead === false
      ) {
        this.ninjaShouldContinue === false;

        this.$createjs.Tween.get(this.ninja).to(
          { x: this.ninjaXOrigin, y: this.ninjaYOrigin },
          1500,
          createjs.Ease.circOut
        );
      }
    },
    setAnswerBox() {
      this.answerBoxTextLeft = new this.$createjs.Text(
        this.getCurrentOption(0).value,
        this.defaultCanvasWidth / 30 + 'px Comic Sans MS',
        '#fff'
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
        '#fff'
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
        '#fff'
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
        // _container.addChild(_answerText);
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
      this.selectedIndex = index;

      switch (index) {
        case 0:
          this.ninja.gotoAndPlay('moveLeft');
          this.ninjaX = 300;
          this.ninjaY = 300;
          break;
        case 1:
          this.ninja.gotoAndPlay('moveStraight');
          this.ninjaX = 400;
          this.ninjaY = 400;
          break;
        case 2:
          this.ninja.gotoAndPlay('moveRight');
          this.ninjaX = 500;
          this.ninjaY = 500;
          break;
        default:
          break;
      }

      let moveToPlatform = this.$createjs.Tween.get(this.ninja).to(
        { x: this.ninjaX, y: this.ninjaY },
        500,
        createjs.Ease.circOut
      );

      moveToPlatform.addEventListener('complete', () => {
        console.log('Complete tween');
        this.ninja.gotoAndPlay('success');
        if (!gameLost) {
          this.clearAnswerBox();
          this.ninjaContinues(index);
        } else {
          this.ninjaDies(index);
        }
      });
    },
    ninjaContinues(index) {
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
