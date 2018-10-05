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
  },
    mounted(){
    this.init();
  },

  data() {
    return {
      openScore: false
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
        { src: "statics/game/flappy/bird-open-01.png", id: "birdOpen" },
        { src: "statics/game/flappy/bird-open-02.png", id: "birdOpen2" },
        { src: "statics/game/flappy/bird-close-01.png", id: "birdClose" },
        { src: "statics/game/flappy/bird-close-02.png", id: "birdClose2" },
        { src: "statics/game/flappy/floor-block.png", id: "ground" },
        { src: "statics/game/flappy/pipe-top1.png", id: "pipeTopSmall" },
        { src: "statics/game/flappy/pipe-top2.png", id: "pipeTopBig" },
        { src: "statics/game/flappy/pipe-bot1.png", id: "pipeBotSmall" },
        { src: "statics/game/flappy/pipe-bot2.png", id: "pipeBotBig" },
        { src: "statics/game/flappy/pipe-mid1.png", id: "pipeMidSmall" },
        { src: "statics/game/flappy/pipe-mid2.png", id: "pipeMidBig" },
        { src: "statics/game/flappy/answer-box.png", id: "answerBox" },
        { src: "statics/game/flappy/flappy-button.png", id: "flappyBtn" }
      ]);
      manifest = manifest.concat(this.getImageFromQuestion());
      this.queue.loadManifest(manifest);

      document.onkeydown = this.handleKeyDown;

      this.stage = new this.$createjs.Stage("gameCanvas");
      this.$createjs.Touch.enable(this.stage);
    },
    handleKeyDown () {

    },
    handleComplete() {
      this.initGameValues(); // *Keep!
      this.setGameShell(); // *Keep!


      this.gameStart(); // *Keep!
    },
    tick(event) {
      this.stage.update(event);
    },
    showAnswerArea() {
      this.restart()
    }
  }
};
</script>
