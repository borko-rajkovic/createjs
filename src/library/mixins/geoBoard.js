export default {
  data () {
    return {
      gridSize: 35,
      noOfCol: 10,
      noOfRow: 10,
      margin: 25,
      showBoardScale: true,
      boardScale: 1,
      boardScaleUnit: 'cm',
      polygon: [
        {label: 'A', x: 3, y: 3, draggable: true, showLabel: true},
        {label: 'B', x: 7, y: 3, draggable: true, showLabel: true},
        {label: 'C', x: 7, y: 7, draggable: true, showLabel: true},
        {label: 'D', x: 3, y: 7, draggable: true, showLabel: true}
      ],
      decimalPlace: 1
    }
  },
  computed: {
    geoBoardSetting () {
      return {
        gridSize: this.gridSize,
        noOfCol: this.noOfCol,
        noOfRow: this.noOfRow,
        margin: this.margin,
        showBoardScale: this.showBoardScale,
        boardScale: this.boardScale,
        boardScaleUnit: this.boardScaleUnit,
        polygon: this.polygon,
        decimalPlace: this.decimalPlace
      }
    }
  }
}