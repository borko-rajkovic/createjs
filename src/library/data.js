export default {
  meanDegree: function () {
    let dataSet = {
      unit: '°C',
      frequency: 'month',
      data: [
        {year: 2017, month: 1, value: 18.5},
        {year: 2017, month: 2, value: 17},
        {year: 2017, month: 3, value: 19.3},
        {year: 2017, month: 4, value: 23.3},
        {year: 2017, month: 5, value: 26.0},
        {year: 2017, month: 6, value: 28.8},
        {year: 2017, month: 7, value: 28.7},
        {year: 2017, month: 8, value: 29.3},
        {year: 2017, month: 9, value: 29.0},
        {year: 2017, month: 10, value: 26.3},
        {year: 2017, month: 11, value: 22.2},
        {year: 2017, month: 12, value: 17.8}
      ]
    }
    return dataSet
  },
  humidity: function () {
    let dataSet = {
      unit: '%',
      frequency: 'month',
      data: [
        {year: 2017, month: 1, value: 79},
        {year: 2017, month: 2, value: 75},
        {year: 2017, month: 3, value: 81},
        {year: 2017, month: 4, value: 81},
        {year: 2017, month: 5, value: 82},
        {year: 2017, month: 6, value: 83},
        {year: 2017, month: 7, value: 83},
        {year: 2017, month: 8, value: 80},
        {year: 2017, month: 9, value: 80},
        {year: 2017, month: 10, value: 71},
        {year: 2017, month: 11, value: 76},
        {year: 2017, month: 12, value: 66}
      ]
    } 
    return dataSet
  },
  dataList: function () {
    return ['meanDegree', 'humidity']
  }
}