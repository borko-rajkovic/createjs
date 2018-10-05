<template>
  <div>
    <canvas ref="gameCanvas" id="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script>
import GameShellMixin from "../library/mixins/gameShell";
export default {
  name: "game",
  mixins: [GameShellMixin],
  created() {
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute("src", "statics/js/ndgmr.Collision.js");
    document.head.appendChild(recaptchaScript);
  },

  data() {
    return {
      openScore: false,
      // *New variables!
      scene: null,
      menu: null,
      w: null,
      h: null,
      wMenu: null,
      hMenu: null,
      loader: null,
      startX: null,
      startY: null,
      answerBoxPositions: null,
      tripleArray: null,
      answerBox: null,
      answers: null,
      // bird: null,
      ground: null,
      rotationDelta: null,
      started: false,
      startJump: false, // Has the jump started?
      max: 4,
      min: 1,
      numberOne: null,
      numberTwo: null,
      resultSum: null,
      KEYCODE_SPACE: 32, //usefull keycode SPACE
      KEYCODE_ESC: 27, //usefull keycode ESC
      taskFlag: true,
      // ride variables
      carXPosition:442,
      carYPosition:850,
      lenHeader:180,
      deltaX:210,
      xMin:337,
      xMax:652,
      velocity:210,
      numAnswers:3,
      answersDelay:0,
      answersDelayConstant:0, 
      shouldRemoveChildren:false,
      leftRoadX:163,
      rightRoadX:798,
      leftRoadLineX:393,
      rightRoadLineX:593, 
      treesRightX:834,
      adjustVelocity:3,
      yDisplacement:0,
      backgroundLayer: null
    };
  },

  computed: {},

  methods: {
    init() {
      this.gameShellInit(); // *Keep!

      this.queue = new this.$createjs.LoadQueue(true);
      this.queue.on("complete", this.handleComplete, this);
      let manifest = this.gameShellManifest.concat([
        // *New manifest!
        { src: "statics/game/ride/race-car-01.png", id: "raceCar01" },
        { src: "statics/game/ride/race-car-02.png", id: "raceCar02" },
        { src: "statics/game/ride/road-line.png", id: "roadLine" },
        { src: "statics/game/ride/road-side.png", id: "roadSideLeft" },
        { src: "statics/game/ride/road-sideInv.png", id: "roadSideRight" },
        { src: "statics/game/ride/trees-left.png", id: "treesLeft" },
        { src: "statics/game/ride/trees-right.png", id: "treesRight" },
        { src: "statics/game/ride/lives-bg.png", id: "livesBg" },
        { src: "statics/game/ride/button-left.png", id: "buttonLeft" },
        { src: "statics/game/ride/button-right.png", id: "buttonRight" },
        { src: "statics/game/ride/flag.png", id: "answerBox" }
      ]);

      manifest = manifest.concat(this.getImageFromQuestion());
      this.queue.loadManifest(manifest);

      // *New code!
      document.onkeydown = this.handleKeyDown;

      this.stage = new this.$createjs.Stage("gameCanvas");
      this.$createjs.Touch.enable(this.stage);

      this.w = this.stage.canvas.width;
      this.h = this.stage.canvas.height;
    },

    handleComplete() {
      this.initGameValues(); // *Keep!
      this.setGameShell(); // *Keep!

      // image background, image score and header line are loaded in shell
      this.mask = new this.$createjs.Shape();
      this.mask.graphics.f("#f00").dr(0, this.lenHeader, this.w, this.h); 
      
      // this.initLivesBg();
      // left trees
      var treeLeftImg = this.queue.getResult("treesLeft");
      this.initLeftTrees(treeLeftImg);
      this.initLeftTrees2(treeLeftImg);    
      // left road  
      var leftRoadSideImg = this.queue.getResult("roadSideLeft");
      this.initLeftRoadSide(leftRoadSideImg);
      this.initLeftRoadSide2(leftRoadSideImg);
      // lines
      var roadLineImg = this.queue.getResult("roadLine");
      this.initLeftRoadLine(roadLineImg);
      this.initLeftRoadLine2(roadLineImg);
      this.initRightRoadLine(roadLineImg);
      this.initRightRoadLine2(roadLineImg);      
      // right road
      var rightRoadSideImg = this.queue.getResult("roadSideRight");
      this.initRightRoadSide(rightRoadSideImg);
      this.initRightRoadSide2(rightRoadSideImg); 
      // right trees     
      var treesRightImg = this.queue.getResult("treesRight");
      this.initRightTrees(treesRightImg);
      this.initRightTrees2(treesRightImg);    

      this.initCar();
      this.createGameObjectContainers();
      this.initObjectPositions();
      this.initButtons();
      this.noOfLife = 3;
      // this.stage.addEventListener("stagemousedown", this.handleJumpStart);

      this.$createjs.Ticker.timingMode = this.$createjs.Ticker.RAF;

      this.gameStart(); // *Keep!
      // console.log("handleComplete");
    },

    handleKeyDown(e) {
      //cross browser issues exist
      if (!e) {
        var e = window.event;
      }
    },

    handleStartGame() {
        this.$createjs.Ticker.paused = false;
    },

    restart() {
      //hide anything on stage and show the score
      this.gameReady = true
      this.answers.removeAllChildren();
      this.answersText.removeAllChildren();
      this.started = true;
      this.openScore = true;
      this.startJump = false;
      this.taskFlag = true;
      this.answersDelay = 0;
      this.shouldRemoveChildren = false;

      // Set initial position and scale 1 to 1
      this.car.setTransform(this.carXPosition, this.carYPosition, 1, 1);
      this.$createjs.Tween.removeTweens(this.car);
      // console.log("restart");
    },

    start() {
      //hide anything on stage and show the score
      this.answers.removeAllChildren();
      this.answersText.removeAllChildren();
      this.started = true;
      this.startJump = false;
      this.car.gotoAndPlay("run");
      // console.log("start");
    },

    randomInteger(min, max) {
      var rand = min - 0.5 + Math.random() * (max - min + 1);
      rand = Math.round(rand);
      return rand;
    },

    generateResults(sum) {
      var triple = [sum - 1, sum, sum + 1];
      return triple.sort(this.compareRandom);
    },

    compareRandom(a, b) {
      return Math.random() - 0.5;
    },

    generateTask() {
      this.numberOne = this.randomInteger(this.min, this.max);
      this.numberTwo = this.randomInteger(this.min, this.max);
      this.resultSum = this.numberOne + this.numberTwo;
      return (
        this.numberOne.toString() +
        " + " +
        this.numberTwo.toString() +
        " " +
        "= ?"
      );
    },

    initLeftTrees(treeLeftImg) {
      this.treesLeft = new this.$createjs.Shape();
      this.treesLeft.graphics
        .beginBitmapFill(treeLeftImg)
        .drawRect(0, 0, treeLeftImg.width, this.h);
      this.treesLeft.mask = this.mask;  
      this.stage.addChild(this.treesLeft);
    },

    initLeftTrees2(treeLeftImg) {
      this.treesLeft2 = new this.$createjs.Shape();
      this.treesLeft2.graphics
        .beginBitmapFill(treeLeftImg)
        .drawRect(0, 0, treeLeftImg.width, this.h);
      this.treesLeft2.mask = this.mask;  
      this.treesLeft.y = -this.h;
      this.stage.addChild(this.treesLeft2);
    },

    initLeftRoadSide(leftRoadSideImg){
      this.leftRoadSide = new this.$createjs.Shape();
      this.leftRoadSide.graphics
        .beginBitmapFill(leftRoadSideImg)
        .drawRect(0, 0, leftRoadSideImg.width, this.h);
      this.leftRoadSide.mask = this.mask;   
      this.leftRoadSide.x = this.leftRoadX;    
      this.stage.addChild(this.leftRoadSide);
    },

    initLeftRoadSide2(leftRoadSideImg){
      this.leftRoadSide2 = new this.$createjs.Shape();
      this.leftRoadSide2.graphics
        .beginBitmapFill(leftRoadSideImg)
        .drawRect(0, 0, leftRoadSideImg.width, this.h);   
      this.leftRoadSide2.mask = this.mask; 
      this.leftRoadSide2.x = this.leftRoadX;         
      this.leftRoadSide2.y = -this.h;
      this.stage.addChild(this.leftRoadSide2);
    },

    initLeftRoadLine(roadLineImg) {
      this.leftRoadLine = new this.$createjs.Shape();
      this.leftRoadLine.graphics
        .beginBitmapFill(roadLineImg)
        .drawRect(0, 0, roadLineImg.width, this.h);
      this.leftRoadLine.mask = this.mask;
      this.leftRoadLine.x = this.leftRoadLineX;
      this.stage.addChild(this.leftRoadLine);
    },

    initLeftRoadLine2(roadLineImg) {
      this.leftRoadLine2 = new this.$createjs.Shape();
      this.leftRoadLine2.graphics
        .beginBitmapFill(roadLineImg)
        .drawRect(0, 0, roadLineImg.width, this.h);
      this.leftRoadLine2.mask = this.mask;
      this.leftRoadLine2.x = this.leftRoadLineX;      
      this.leftRoadLine2.y = -this.h;
      this.stage.addChild(this.leftRoadLine2);
    },

    initRightRoadLine(rightRoadLineImg) {
      this.rightRoadLine = new this.$createjs.Shape();
      this.rightRoadLine.graphics
        .beginBitmapFill(rightRoadLineImg)
        .drawRect(0, 0, rightRoadLineImg.width, this.h);
      this.rightRoadLine.mask = this.mask; 
      this.rightRoadLine.x = this.rightRoadLineX;
      this.stage.addChild(this.rightRoadLine);
    },

    initRightRoadLine2(rightRoadLineImg) {
      this.rightRoadLine2 = new this.$createjs.Shape();
      this.rightRoadLine2.graphics
        .beginBitmapFill(rightRoadLineImg)
        .drawRect(0, 0, rightRoadLineImg.width, this.h);  
      this.rightRoadLine2.mask = this.mask; 
      this.rightRoadLine2.x = this.rightRoadLineX;
      this.rightRoadLine2.y = -this.h;
      this.stage.addChild(this.rightRoadLine2);
    },

    initRightRoadSide(rightRoadSideImg) {
      this.rightRoadSide = new this.$createjs.Shape();
      this.rightRoadSide.graphics
        .beginBitmapFill(rightRoadSideImg)
        .drawRect(0, 0, rightRoadSideImg.width, this.h);
      this.rightRoadSide.mask = this.mask;  
      this.rightRoadSide.x = this.rightRoadX;     
      this.stage.addChild(this.rightRoadSide);
    },

    initRightRoadSide2(rightRoadSideImg) {
      this.rightRoadSide2 = new this.$createjs.Shape();
      this.rightRoadSide2.graphics
        .beginBitmapFill(rightRoadSideImg)
        .drawRect(0, 0, rightRoadSideImg.width, this.h);  
      this.rightRoadSide2.mask = this.mask; 
      this.rightRoadSide2.x = this.rightRoadX;         
      this.rightRoadSide2.y = -this.h;            
      this.stage.addChild(this.rightRoadSide2);
    },

    initRightTrees(treesRightImg) {
      this.treesRight = new this.$createjs.Shape();
      this.treesRight.graphics
        .beginBitmapFill(treesRightImg)
        .drawRect(0, 0, treesRightImg.width, this.h);
      this.treesRight.mask = this.mask;  
      this.treesRight.x = this.treesRightX; 
      this.stage.addChild(this.treesRight);
    },

    initRightTrees2(treesRightImg) {
      this.treesRight2 = new this.$createjs.Shape();
      this.treesRight2.graphics
        .beginBitmapFill(treesRightImg)
        .drawRect(0, 0, treesRightImg.width, this.h);
      this.treesRight2.mask = this.mask; 
      this.treesRight2.x = this.treesRightX;      
      this.treesRight2.y = -this.h;
      this.stage.addChild(this.treesRight2);
    },

    initCar() {
      var data = new this.$createjs.SpriteSheet({
        framerate: 30,
        images: [ this.queue.getResult("raceCar01"), this.queue.getResult("raceCar02")],
        //set size of frames 
        frames: { width: 120, height: 151, count: 2 },
        // define animation
        animations: { run: [0, 1, "run", 0.4] }
      });
      this.car = new this.$createjs.Sprite(data, "run");
      // Set initial position and scale 1 to 1
      this.car.setTransform(this.carXPosition, this.carYPosition, 1, 1);
      this.stage.addChild(this.car);
    },
    
    initObjectPositions() {
      var scenePosition = 0 

      this.answerBox = new this.$createjs.Bitmap(
        this.queue.getResult("answerBox")
      );

    },

    initButtons() {
      // left button
      this.buttonLeft = new this.$createjs.Bitmap(
        this.queue.getResult("buttonLeft"));
		  this.stage.addChild(this.buttonLeft).set({x: this.w-315, y: 800});      
      this.buttonLeft.addEventListener("click", this.moveCarLeft);

      // right button
      this.buttonRight = new this.$createjs.Bitmap(
        this.queue.getResult("buttonRight"));
		  this.stage.addChild(this.buttonRight).set({x: this.w-165, y: 800});      
      this.buttonRight.addEventListener("click", this.moveCarRight);
    },

    moveCarLeft() {
      if (this.car.x >= this.xMin) {
        this.$createjs.Tween.get(this.car)
          .to({x: this.car.x-this.deltaX}, 200);
      }
    },

    moveCarRight() {
      if (this.car.x < this.xMax) {
        this.$createjs.Tween.get(this.car)
          .to({x: this.car.x+this.deltaX}, 200);
      }
    },
    
    createGameObjectContainers() {
      this.scene = new this.$createjs.Container();

      this.answers = new this.$createjs.Container();
      this.answersText = new this.$createjs.Container();

      this.stage.addChild(this.scene);
      this.scene.addChild(this.answers, this.answersText);
    },

    showAnswerArea() {
      this.restart()
    },

    die() {
      this.gameStop();
      // console.log("die");
    },

    tick(event) {

      var deltaS = event.delta / 1000;

      if (this.started) {

        if (this.answersDelay == 0) {

          if (this.taskFlag) {
            console.log('taskFlag: true')
            // Answers boxes
            this.question.text = this.generateTask();
            this.tripleArray = this.generateResults(this.resultSum);

            for (let i = 0; i < 3; i++) {
              let answerBox = new this.$createjs.Bitmap(
                this.queue.getResult("answerBox")
              )
              answerBox.x = 185 + i * 205               
              answerBox.y = 180           
              let answerBoxText = new this.$createjs.Text(this.tripleArray[i].toString(), 'bold ' + (this.defaultCanvasWidth / 20) + 'px Comic Sans MS', '#000')
              answerBoxText.x = answerBox.x + answerBox.image.width / 2 
              answerBoxText.y = answerBox.y + answerBox.image.height / 2 - 20 
              answerBoxText.width = answerBox.image.width
              answerBoxText.height = answerBox.image.height
              answerBoxText.set({
                textAlign: "center",
                textBaseline: "middle"
              })
              if (this.resultSum.toString() === this.tripleArray[i].toString()) {
                answerBox.name = "right"
              } else {
                answerBox.name = "wrong"
              }
              this.answers.addChild(answerBox);
              this.answersText.addChild(answerBoxText);
            }
            this.taskFlag = false;
            this.openScore = true;
            this.shouldRemoveChildren = false;
          }
          this.answersDelay = this.answersDelayConstant;
        }
        else
          this.answersDelay -= 1;

        for (var i = 0; i < this.numAnswers; i++) {  
          this.answer = this.answers.getChildAt(i);
          this.answerText = this.answersText.getChildAt(i);
          if (this.answer) {
            var collision = ndgmr.checkRectCollision(this.answer, this.car, 1, true);
            if (collision) {
              if (collision.width > 8 && collision.height > 4 && this.openScore == true) {
                this.shouldRemoveChildren = true;
                this.openScore = false;
                // this.taskFlag = true;
                if (this.answer.name === "right") {
                  this.addScore();
                  // console.log("!!!!RIGHT!!!!! " + i);       
                } 
                if (this.answer.name === "wrong" ) {
                  this.deduceLife();   
                  // console.log("!!!!WRONG!!!!! " + i);  
                } 
              }
            }

            // Move answer
            this.answer.y = (this.answer.y + deltaS * this.velocity);
            this.answerText.y = (this.answer.y + deltaS * this.velocity) + this.answer.image.height / 2 -20;
            
            this.yDisplacement = (deltaS * this.velocity)/this.adjustVelocity;
            // Move left trees
            if (this.treesLeft.y <= this.h)
              this.treesLeft.y += this.yDisplacement;
            else
              this.treesLeft.y = -this.h;

            if (this.treesLeft2.y <= this.h)
              this.treesLeft2.y += this.yDisplacement;
            else
              this.treesLeft2.y = -this.h;

            // Move left road side
            if (this.leftRoadSide.y <= this.h)
              this.leftRoadSide.y += this.yDisplacement;
            else
              this.leftRoadSide.y = -this.h;
            
            if (this.leftRoadSide2.y <= this.h)
              this.leftRoadSide2.y += this.yDisplacement;
            else
              this.leftRoadSide2.y = -this.h;

            // Move left line
            if (this.leftRoadLine.y <= this.h)
              this.leftRoadLine.y += this.yDisplacement;
            else
              this.leftRoadLine.y = -this.h;
            
            if (this.leftRoadLine2.y <= this.h)
              this.leftRoadLine2.y += this.yDisplacement;
            else
              this.leftRoadLine2.y = -this.h;     
              
            // Move right line
            if (this.rightRoadLine.y <= this.h)
              this.rightRoadLine.y += this.yDisplacement;
            else
              this.rightRoadLine.y = -this.h;
            
            if (this.rightRoadLine2.y <= this.h)
              this.rightRoadLine2.y += this.yDisplacement;
            else
              this.rightRoadLine2.y = -this.h;               

            // Move right road side
            if (this.rightRoadSide.y <= this.h)
              this.rightRoadSide.y += this.yDisplacement;
            else
              this.rightRoadSide.y = -this.h;
            
            if (this.rightRoadSide2.y <= this.h)
              this.rightRoadSide2.y += this.yDisplacement;
            else
              this.rightRoadSide2.y = -this.h;
              
            // Move right trees
            if (this.treesRight.y <= this.h)
              this.treesRight.y += this.yDisplacement;
            else 
              this.treesRight.y = -this.h;
            
            if (this.treesRight2.y <= this.h)
              this.treesRight2.y += this.yDisplacement;
            else 
              this.treesRight2.y = -this.h;             

            if (this.shouldRemoveChildren && this.answer.y >= this.h) {
              this.taskFlag = true;
              this.answers.removeAllChildren();
              this.answersText.removeAllChildren();
            }
          }
        }
      }
      this.stage.update(event);
    },
  }
};
</script>