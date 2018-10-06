<template>
  <game-engine1 :noOfLife="noOfLife" :scorePerAnswer="scorePerAnswer" :questions="questions"></game-engine1>
</template>

<script>
import GameEngine1 from './gameEngine1';
export default {
  name: 'game-sample1',
  components: {
    GameEngine1
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
                {
          title: '48-26=?',
          options: [
            { value: 18, valueType: 'text', correct: false },
            { value: 20, valueType: 'text', correct: false },
            { value: 22, valueType: 'text', correct: true }
          ]
        },
        {
          title: 'Which color is red?',
          options: [
            {
              value: 'statics/game/sample/button-blue.png',
              valueType: 'image',
              correct: false
            },
            {
              value: 'statics/game/sample/button-green.png',
              valueType: 'image',
              correct: false
            },
            {
              value: 'statics/game/sample/button-red.png',
              valueType: 'image',
              correct: true
            }
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
