export default {
  evaluateMathFunctionValue: function (mathFunctionName, values) {
    switch (mathFunctionName) {
      case 'LCM':
        return this.lcm(values)
        break;
      default:
        return ''
    }
  },
  lcm: function (values) {
    console.log(values)
    if (values.length === 0) {
      return 1
    }
    else if (values.length === 1) {
      return parseInt(values[0])
    }
    else {
      let _lastResult = parseInt(values[0])
      for (let j = 1; j < values.length; j++) {
        _lastResult = this.lcm_two_numbers(_lastResult, parseInt(values[j]))
      }
      return _lastResult
    }
  },
  lcm_two_numbers: function (x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number')) {
      return false
    }
    return (!x || !y) ? 0 : Math.abs((x * y) / this.gcd_two_numbers(x, y))
  },
  gcd_two_numbers: function (x, y) {
    x = Math.abs(x)
    y = Math.abs(y)
    while (y) {
      var t = y
      y = x % y
      x = t
    }
    return x
  }
}