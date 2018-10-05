export default {
  data () {
    return {
      operators: ['+', '-', '*', '/'],
    }
  },
  methods: {
    displayOperator (operator) {
      let _operators = {'*': '&times;', '/': '&divide;'}
      if (typeof _operators[operator] !== 'undefined') {
        return _operators[operator]
      }
      else {
        return operator
      }
    }
  }
}