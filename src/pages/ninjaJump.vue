<template>
  <ninja-jump-game-engine :noOfLife="noOfLife" :scorePerAnswer="scorePerAnswer" :questions="questions"></ninja-jump-game-engine>
</template>

<script>
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
