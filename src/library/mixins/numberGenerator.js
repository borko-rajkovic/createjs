export default {
  data () {
    return {
      mode: 'multiplySetBoth', // single, minMaxSet, multiplySet
      rangeFrom: 1,
      rangeTo: 20,
      setNoOfValue: 3,
      result: '',
      resultSet: [],
      setMin: 0,
      setMax: 10,
      meanInt: true,
      factor: 3,
      inorder: 'random',
      setNoOfCorrect: 3
    }
  },
  computed: {
    mean () {
      if (this.resultSet.length > 0) {
        let _total = 0
        for (let i = 0; i < this.resultSet.length; i++) {
          _total += this.resultSet[i]
        }
        return Math.round(_total / this.resultSet.length * 10) / 10
      }
      else {
        return ''
      }
    }
  },
  methods: {
    displaySetting (setting) {
      if (typeof setting !== 'undefined') {
        switch (setting.mode) {
          case 'single':
            return this.displaySingle(setting)
            break
          case 'minMaxSet':
            return this.displayMinMaxSet(setting)
            break
          case 'multiplySet':
            return this.displayMultiply(setting)
            break
          case 'multiplySetBoth':
            return this.displayMultiplyBoth(setting)
            break
          default:
            return ''
        }
      }
      else {
        return ''
      }
    },
    displaySingle (setting) {
      return '(range: ' + setting.rangeFrom + ' - ' + setting.rangeTo + ')'
    },
    displayMultiply (setting) {
      return '(range: ' + setting.rangeFrom + ' - ' + setting.rangeTo + ', factor: ' + setting.factor + ', number of value: ' + setting.setNoOfValue + ')'
    },
    displayMinMaxSet (setting) {
      return '(range: ' + setting.setMin + ' - ' + setting.setMax + ', number of value: ' + setting.setNoOfValue + ')'
    },
    displayMultiplyBoth (setting) {
      return '(range: ' + setting.setMin + ' - ' + setting.setMax + ', number of value: ' + setting.setNoOfValue + ', number of correct: ' + setting.setNoOfCorrect + ')'
    },
    meanByData (data, resultSet) {
      if (resultSet.length > 0) {
        let _total = 0
        for (let i = 0; i < resultSet.length; i++) {
          _total += resultSet[i]
        }
        return Math.round(_total / resultSet.length * 10) / 10
      }
      else {
        return ''
      }
    },
    sortResultByData (data, resultSet) {
      if (data.inorder === 'desc') {
        resultSet.sort((a, b) => {
          return parseInt(b) - parseInt(a)
        })
      }
      else if (data.inorder === 'asc') {
        resultSet.sort((a, b) => {
          return parseInt(a) - parseInt(b)
        })
      }
      return resultSet
    },
    generateMinMaxSetByData (data) {
      let _resultSet = []
      for (let i = 0; i < data.setNoOfValue; i++) {
        _resultSet.push(Math.floor(Math.random() * (data.setMax - data.setMin + 1)) + parseInt(data.setMin))
      }
      let _mean = this.meanByData(data, _resultSet)
      if (data.meanInt && !Number.isInteger(_mean)) {
        let _dif = Math.round((_mean - Math.floor(_mean))  * data.setNoOfValue)
        let _count = 0
        for (let i = 0; i < _resultSet.length; i++) {
          if (_count < _dif) {
            if (_resultSet[i] > 0) {
              _resultSet[i] -= 1
              _count += 1
            }
          }
        }
      }
      this.sortResultByData(data, _resultSet)
      return _resultSet
    },
    generateMultiplyByData (data) {
      let _resultSet = []
      let _values = []
      for (let i = data.rangeFrom; i <= data.rangeTo; i++) {
        if (i !== 0 && i % data.factor === 0) {
          _values.push(i)
        }
      }
      _values = this.$_.shuffle(_values)
      for (let i = 0; i < data.setNoOfValue; i++) {
        if (typeof _values[i] !== 'undefined') {
          _resultSet.push(_values[i])
        }
        else {
          console.log('Not enough number')
        }
      }
      this.sortResultByData(data, _resultSet)
      return _resultSet
    },
    generateMultiplyBothByData (data) {
      let _resultSet = []
      let _correctValues = []
      let _wrongValues =[]
      let _correctResultSet = []
      let _wrongResultSet = []
      for (let i = data.rangeFrom; i <= data.rangeTo; i++) {
        if (i !== 0 && i % data.factor === 0) {
          _correctValues.push(i)
        }
        else {
          _wrongValues.push(i)
        }
      }
      _correctValues = this.$_.shuffle(_correctValues)
      _wrongValues = this.$_.shuffle(_wrongValues)
      let _noOfCorrect = data.setNoOfCorrect
      let _noOfWrong = data.setNoOfValue - data.setNoOfCorrect
      for (let i = 0; i < _noOfCorrect; i++) {
        if (typeof _correctValues[i] !== 'undefined') {
          _correctResultSet.push({correct: true, value: _correctValues[i]})
        }
        else {
          console.log('Not enough number')
        }
      }
      for (let i = 0; i < _noOfWrong; i++) {
        if (typeof _wrongValues[i] !== 'undefined') {
          _wrongResultSet.push({correct: false, value: _wrongValues[i]})
        }
        else {
          console.log('Not enough number')
        }
      }
      _resultSet.push(..._correctResultSet)
      _resultSet.push(..._wrongResultSet)
      _resultSet = this.$_.shuffle(_resultSet)
      return _resultSet
    },
    generateSingle () {
      this.result = Math.floor(Math.random() * (this.rangeTo - parseInt(this.rangeFrom) + 1)) + parseInt(this.rangeFrom)
    },
    generateMinMaxSet () {
      this.resultSet = this.generateMinMaxSetByData(this.$data)
    },
    generateMultiply () {
      this.resultSet = this.generateMultiplyByData(this.$data)
    },
    generateMultiplyBoth () {
      this.resultSet = this.generateMultiplyBothByData(this.$data)
    },
    sortResult () {
      if (this.inorder === 'desc') {
        this.resultSet.sort((a, b) => {
          return parseInt(b) - parseInt(a)
        })
      }
      else if (this.inorder === 'asc') {
        this.resultSet.sort((a, b) => {
          return parseInt(a) - parseInt(b)
        })
      }
    },
    generate () {
      switch (this.mode) {
        case 'single':
          this.generateSingle()
          break
        case 'minMaxSet':
          this.generateMinMaxSet ()
          break
        case 'multiplySet':
          this.generateMultiply ()
          break
        case 'multiplySetBoth':
          this.generateMultiplyBoth ()
          break
        default:
          return ''
      }
    }
  }
}