<template>
  <ninja-jump-game-engine :noOfLife="noOfLife" :scorePerAnswer="scorePerAnswer" :questions="questions"></ninja-jump-game-engine>
</template>

<script>
// TODO
// statics/game/ninjajump/answer-box.png
// statics/game/ninjajump/background.png
// statics/game/ninjajump/bg-texture.png
// statics/game/ninjajump/bg-wall.png
// statics/game/ninjajump/button1.png
// statics/game/ninjajump/button2.png
// statics/game/ninjajump/button3.png
// statics/game/ninjajump/header-line.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-01.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-02.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-03.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-04.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-05.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-06.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-07.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-08.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-09.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-10.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-11.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-12.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-13.png
// statics/game/ninjajump/lava-separatestatics/game/ninjajump/lava-14.png
// statics/game/ninjajump/lava.png
// statics/game/ninjajump/ninja.png
// statics/game/ninjajump/platform-1.png
// statics/game/ninjajump/platform-2.png
// statics/game/ninjajump/platform-3.png
// statics/game/ninjajump/score-bg.png


import NinjaJumpGameEngine from './ninjaJumpGameEngine';
export default {
  name: 'ninja-jump',
  components: {
    NinjaJumpGameEngine
  },
  computed: {
    noOfLife() {
      return 3;
    },
    scorePerAnswer() {
      return 10;
    },
    questions() {
      return [
        // { title: 'Which color is red?', options: [ {value: 'statics/game/sample/button-blue.png', valueType: "image", correct: false}, {value: 'statics/game/sample/button-green.png', valueType: "image", correct: false}, {value: 'statics/game/sample/button-red.png', valueType: "image", correct: true} ] },
        {
          title: 'Multiple of 3',
          multiple: 3,
          correctAnswer: 6,
          distractors: [7, 5],
          options: [
            { value: 7, valueType: 'text', correct: false },
            { value: 6, valueType: 'text', correct: true },
            { value: 5, valueType: 'text', correct: false }
          ]
        },
        {
          title: 'Multiple of 2',
          multiple: 2,
          correctAnswer: 6,
          distractors: [9, 5],
          options: [
            { value: 9, valueType: 'text', correct: false },
            { value: 4, valueType: 'text', correct: true },
            { value: 5, valueType: 'text', correct: false }
          ]
        }
      ];
    }
  }
};
</script>
