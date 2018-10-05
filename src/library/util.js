
let util = {}
if (!window.util) window.util = util

util.IntegerIterator = class {
  constructor (start, end, min, max) {
    // assert min <= start <= max && min <= end <= max
    this._start = start
    this._end = end
    this._min = min
    this._max = max
    this._value = null
  }

  // let total = (start <= end ? (end - start + 1) : (max - start + 1) + (end - min + 1))
  hasNext () {
    if (this._value === null) {
      this._value = this._start
    }
    else {
      if (this._start <= this._end) {
        if (this._value < this._end) {
          this._value++
        }
        else {
          this._value = null
        }
      }
      else {
        if (this._start <= this._value && this._value < this._max) {
          this._value++
        }
        else
        if (this._value === this._max) {
          this._value = this._min
        }
        else
        if (this._min <= this._value && this._value < this._end) {
          this._value++
        }
        else {
          this._value = null
        }
      }
    }
    return (this._value != null)
  }

  next () {
    return this._value
  }
}
/*
console.log('1 - 10: ');
var itr = new util.IntegerIterator(1, 1, 1, 10);
var arr = []; while (itr.hasNext()) {arr.push(itr.next());} console.log('arr = ' + JSON.stringify(arr));
console.log('8 - 2: ');
var itr = new util.IntegerIterator(8, 8, 1, 10);
var arr = []; while (itr.hasNext()) {arr.push(itr.next());} console.log('arr = ' + JSON.stringify(arr));
*/

export default util
