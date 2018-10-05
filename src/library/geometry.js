/*
 * Geometry package
 *
 * geom.Util
 * geom.Matrix
 * geom.Object
 * geom.Vector
 * geom.Point
 * geom.Line
 * geom.Edge
 * geom.LineEdge
 * geom.Shape
 * geom.Polygon
 */

import util from './util.js'
import geomtest from './geometry.test.js'

let geom = { _flags: {} }
if (!window.geom) window.geom = geom

/*
 * geom.Util
 */
geom.Util = class {
  static get epsilon () { return 1e-10 }

  static distance (x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
  }

  /*
   * number determinant(number a, number b, number c, number d)
   * return the determinant of the matrix
   *     a    b
   *     c    d
   */
  static determinant (a, b, c, d) {
    // console.log('|' + a + ' ' +  b + ' ' + c + ' '  + d + '|')
    return a * d - b * c
  }

  static epsilonEquals (value1, value2) {
    let ok = false
    if (isFinite(value1) && isFinite(value2)) {
      let diff = Math.abs(value1 - value2)
      ok = (diff < this.epsilon)
    }
    return ok
  }

  static epsilonGt (value1, value2) {
    let ok = false
    if (isFinite(value1) && isFinite(value2)) {
      ok = (value1 > (value2 - this.epsilon))
    }
    return ok
  }

  static epsilonGe (value1, value2) {
    let ok = false
    if (isFinite(value1) && isFinite(value2)) {
      ok = (value1 >= (value2 - this.epsilon))
    }
    return ok
  }

  static epsilonLt (value1, value2) {
    let ok = false
    if (isFinite(value1) && isFinite(value2)) {
      ok = ((value1 - this.epsilon) < value2)
    }
    return ok
  }

  static epsilonLe (value1, value2) {
    let ok = false
    if (isFinite(value1) && isFinite(value2)) {
      ok = ((value1 - this.epsilon) <= value2)
    }
    return ok
  }
}

/*
 * geom.IntersectionResult(number n, Array intersections)
 */
geom.IntersectionResult = function (n, intersections) {
  this.getNumberOfIntersections = function () { return n }
  this.getIntersections = function () { return intersections }
}

/*
 * geom.Matrix(Array arr)
 */
geom.Matrix = class {
}

/*
 * geom.Object
 */
geom.Object = class {
}
// geom.Object.constructor = geom.Object

/*
 * geom.Vector(number x, number y, ...)
 */
geom.Vector = class extends geom.Object {
  _cachedProps = {}
  _components = []

  constructor (...args) {
    super()
    if (args.length === 1 && (args[0] instanceof Array)) {
      let arr = args[0]
      for (let i = 0; i < arr.length; i++) {
        if ((typeof arr[i]) === 'number') {
          this._components.push(arr[i])
        }
        else {
          throw new Error('Exception: Invalid geom.Vector constructor arguments.')
        }
      }
    }
    else {
      for (let i = 0; i < args.length; i++) {
        if ((typeof args[i]) === 'number') {
          this._components.push(args[i])
        }
        else {
          throw new Error('Exception: Invalid geom.Vector constructor arguments.')
        }
      }
    }
  }

  dimension () {
    return this._components.length
  }

  get (i) {
    return this._components[i]
  }

  negate () {
    let arr = []
    for (let i = 0; i < this._components.length; i++) {
      arr.push(-this._components[i])
    }
    return new geom.Vector(arr)
  }

  add (v) {
    let arr = []
    for (let i = 0; i < this._components.length; i++) {
      arr.push(this._components[i] + v.get(i))
    }
    return new geom.Vector(arr)
  }

  minus (v) {
    let arr = []
    for (let i = 0; i < this._components.length; i++) {
      arr.push(this._components[i] - v.get(i))
    }
    return new geom.Vector(arr)
  }

  multiply (scale) {
    let arr = []
    for (let i = 0; i < this._components.length; i++) {
      arr.push(scale * this._components[i])
    }
    return new geom.Vector(arr)
  }

  norm () {
    if ((typeof this._cachedProps['norm']) === 'undefined') {
      let ss = 0
      for (let i = 0; i < this._components.length; i++) {
        ss += this._components[i] * this._components[i]
      }
      this._cachedProps['norm'] = Math.sqrt(ss)
    }
    return this._cachedProps['norm']
  }

  /*
   * number dot(geom.Vector v)
   */
  dot (v) {
    let sum = 0
    for (let i = 0; i < this._components.length; i++) {
      sum += this._components[i] * v.get(i)
    }
    return sum
  }

  /*
   * geom.Vector cross(geom.Vector v)
   */
  cross (v) {
    let x1 = this._components[0]
    let y1 = this._components[1]
    let z1 = this._components[2]
    if (isNaN(z1)) z1 = 0
    let x2 = v.get(0)
    let y2 = v.get(1)
    let z2 = v.get(2)
    if (isNaN(z2)) z2 = 0
    let c = [
      geom.Util.determinant(y1, z1, y2, z2),
      geom.Util.determinant(x1, z1, x2, z2),
      geom.Util.determinant(x1, y1, x2, y2)
    ]
    return new geom.Vector(c)
  }

  normalize () {
    let length = this.norm()
    let arr = []
    for (let i = 0; i < this._components.length; i++) {
      arr.push(this._components[i] / length)
    }
    return new geom.Vector(arr)
  }

  angleTo (v) {
    let u1 = this.normalize()
    let u2 = v.normalize()
    let angle = Math.acos(u1.dot(u2)) // in [0, PI]

    u1 = new geom.Vector(u1.get(0), u1.get(1), 0)
    u2 = new geom.Vector(u2.get(0), u2.get(1), 0)
    let crossProduct = u1.cross(u2)
    // console.log('crossProduct = ' + crossProduct.toString())

    if (crossProduct.get(2) < 0) {
      // angle = 2 * Math.PI - angle // [0, 2PI]
      angle = -angle // [-PI, PI]
    }

    return angle
  }

  toString () {
    let str = ''
    for (let i = 0; i < this._components.length; i++) {
      str += (i > 0 ? ' + ' : '') + this._components[i] + String.fromCharCode('i'.charCodeAt(0) + i)
    }
    return str
  }
}
// geom.Vector.prototype = new geom.Object
// geom.Vector.prototype.constructor = geom.Object

/*
 * geom.Point(number x, number y)
 */
geom.Point = class extends geom.Object {
  _x = null;
  _y = null;

  constructor (x, y) {
    super()
    this._x = x
    this._y = y
  }

  x () { return this._x }
  y () { return this._y }

  /*
   * boolean epsilonEquals(geom.Point p)
   */
  epsilonEquals (p) {
    return geom.Util.epsilonEquals(geom.Util.distance(this._x, this._y, p.x(), p.y()), 0)
  }

  shift (dx, dy) {
    return new geom.Point(this._x + dx, this._y + dy)
  }

  getVector () {
    return new geom.Vector(this._x, this._y)
  }

  toString () {
    return '(' + this._x + ', ' + this._y + ')'
  }
}
// geom.Point.prototype = new geom.Object
// geom.Point.prototype.constructor = geom.Object

/*
 * geom.Shape
 */
geom.Shape = class extends geom.Object {
  /*
  constructor (edges) {
    super()
    this.edges = edges
  }
  */

  /*
   * number area()
   */
  area () { throw new Error('Unimplemented method area') }

  /*
   * geom.Point centriod()
   */
  centriod () { throw new Error('Unimplemented method centriod') }

  /*
   * geom.Shape shift(number dx, number dy)
   */
  shift (dx, dy) { throw new Error('Unimplemented method shift') }

  /*
   * geom.Shape rotate(number angle)
   * geom.Shape rotate(number angle, geom.Point rotateAbout)
   */
  rotate (angle) { throw new Error('Unimplemented method rotate') }

  /*
   * geom.Shape flip(geom.Line flipAlong)
   */
  flip () { throw new Error('Unimplemented method flip') }

  /*
   * boolean contains(geom.Point p)
   * boolean contains(number x, number y)
   */
  contains () { throw new Error('Unimplemented method contains') }

  /*
   * boolean intersects(geom.Polygon shape)
   */
  intersects (shape) {
    return geom.Shape.intersects(this, shape)
  }

  intersect (shape) {
    return geom.Shape.intersect(this, shape)
  }

  isPolygon () { throw new Error('Unimplemented method isPolygon') }
}
// geom.Shape.prototype = new geom.Object
// geom.Shape.prototype.constructor = geom.Object

geom.Shape.intersects = function (shape1, shape2) {
  let findLineLineIntersects = function (line1, line2) {
    let b = false
    if (geom.Util.epsilonEquals(line1.x1(), line1.x2())) {
      if (geom.Util.epsilonEquals(line2.x1(), line2.x2())) {
        if (geom.Util.epsilonEquals(line1.x1(), line2.x1())) {
          let L1 = line1.length()
          let L2 = line2.length()
          let L3 = (Math.max(line1.y1(), line1.y2(), line2.y1(), line2.y2()) - Math.min(line1.y1(), line1.y2(), line2.y1(), line2.y2()))
          b = geom.Util.epsilonLe(L3, (L1 + L2))
        }
      }
      else {
        let y = line2.y(line1.x1())
        if (y != null) {
          let minY = Math.min(line1.y1(), line1.y2())
          let maxY = Math.max(line1.y1(), line1.y2())
          // if (Math.min(y1, y2) <= y && y <= Math.max(y1, y2)) {
          if (geom.Util.epsilonLe(minY, y) && geom.Util.epsilonLe(y, maxY)) {
            b = true
          }
        }
      }
    }
    else {
      if (geom.Util.epsilonEquals(line2.x1(), line2.x2())) {
        let y = line1.y(line2.x1())
        if (y != null) {
          let minY = Math.min(line2.y1(), line2.y2())
          let maxY = Math.max(line2.y1(), line2.y2())
          if (geom.Util.epsilonLe(minY, y) && geom.Util.epsilonLe(y, maxY)) {
            b = true
          }
        }
      }
      else {
        let m1 = line1.slope()
        let c1 = line1.y(0, true) // line1.yIntercept()
        let m2 = line2.slope()
        let c2 = line2.y(0, true) // line2.yIntercept()
        let m = (m1 - m2)
        let c = (c1 - c2)
        let x = -c / m
        let minX = Math.min(line2.x1(), line2.x2())
        let maxX = Math.max(line2.x1(), line2.x2())
        // if (minX <= x && x <= maxX) {
        if (geom.Util.epsilonLe(minX, x) && geom.Util.epsilonLe(x, maxX)) {
          let y = line1.y(x)
          if (y != null) {
            b = true
          }
        }
      }
    }
    return b
  }

  if ((shape1 instanceof geom.Line) && (shape2 instanceof geom.Line)) {
    return findLineLineIntersects(shape1, shape2)
  }
  else {
    throw new Error('Exception: Invalid geom.Shape.intersects arguments.')
  }
}

geom.Shape.intersect = function (shape1, shape2) {
  let findLineLineIntersect = function (line1, line2) {
    let result = new geom.IntersectionResult(0, [])
    if (geom.Util.epsilonEquals(line1.x1(), line1.x2())) {
      if (geom.Util.epsilonEquals(line2.x1(), line2.x2())) {
        if (geom.Util.epsilonEquals((line1.x1() + line1.x2()) / 2, (line2.x1() + line2.x2()) / 2)) {
          // Return only if they're touching end-to-end.
          let L1 = line1.length()
          let L2 = line2.length()
          let minY = Math.min(line1.y1(), line1.y2(), line2.y1(), line2.y2())
          let maxY = Math.max(line1.y1(), line1.y2(), line2.y1(), line2.y2())
          let L3 = maxY - minY
          if (geom.Util.epsilonEquals(L1 + L2, L3)) {
            let Ys = [line1.y1(), line1.y2(), line2.y1(), line2.y2()] // 1 of them is minY, 1 of them is maxY, and the rest of 2 should be epsilon equal.
            for (let i = 0; i < Ys.length; i++) {
              if (geom.Util.epsilonLt(minY, Ys[i])) {
                result = new geom.IntersectionResult(1, [new geom.Point(line1.x1(), Ys[i])])
                break
              }
            }
          }
          else {
            if (geom.Util.epsilonLt(L1 + L2, L3)) {
              result = new geom.IntersectionResult(0, [])
            }
            else {
              result = new geom.IntersectionResult(Infinity, null)
            }
          }
        }
      }
      else {
        let y = line2.y(line1.x1())
        if (y != null) {
          let minY = Math.min(line1.y1(), line1.y2())
          let maxY = Math.max(line1.y1(), line1.y2())
          if (geom.Util.epsilonLe(minY, y) && geom.Util.epsilonLe(y, maxY)) {
            result = new geom.IntersectionResult(1, [new geom.Point(line1.x1(), y)])
          }
        }
      }
    }
    else {
      if (geom.Util.epsilonEquals(line2.x1(), line2.x2())) {
        let y = line1.y(line2.x1())
        if (y != null) {
          let minY = Math.min(line2.y1(), line2.y2())
          let maxY = Math.max(line2.y1(), line2.y2())
          // if (Math.min(line2.y1(), line2.y2()) <= y && y <= Math.max(line2.y1(), line2.y2())) {
          if (geom.Util.epsilonLe(minY, y) && geom.Util.epsilonLe(y, maxY)) {
            result = new geom.IntersectionResult(1, [new geom.Point(line2.x1(), y)])
          }
        }
      }
      else {
        let m1 = line1.slope()
        let c1 = line1.y(0, true) // line1.yIntercept()
        let m2 = line2.slope()
        let c2 = line2.y(0, true) // line2.yIntercept()
        let m = (m1 - m2)
        let c = (c1 - c2)
        let x = -c / m
        let minX = Math.min(line2.x1(), line2.x2())
        let maxX = Math.max(line2.x1(), line2.x2())
        // if (minX <= x && x <= maxX) {
        if (geom.Util.epsilonLe(minX, x) && geom.Util.epsilonLe(x, maxX)) {
          let y = line1.y(x)
          if (y != null) {
            result = new geom.IntersectionResult(1, [new geom.Point(x, y)])
          }
        }
      }
    }
    return result
  }

  let findLineArcIntersect = function (line, arc) {
    let result = new geom.IntersectionResult(0, [])
    return result
  }

  if ((shape1 instanceof geom.Line) && (shape2 instanceof geom.Line)) {
    return findLineLineIntersect(shape1, shape2)
  }
  else
  if ((shape1 instanceof geom.Line) && (shape2 instanceof geom.Arc)) {
    return findLineArcIntersect(shape1, shape2)
  }
  else
  if ((shape1 instanceof geom.Arc) && (shape2 instanceof geom.Line)) {
    return findLineArcIntersect(shape2, shape1)
  }
  else {
    throw new Error('Exception: Invalid geom.Shape.intersect arguments.')
  }
}

/*
 * geom.Line(geom.Point p1, geom.Point p2)
 * geom.Line(number x1, number y1, number x2, number y2)
 */
geom.Line = class extends geom.Shape {
  _cachedProps = {}
  _x1 = null
  _y1 = null
  _x2 = null
  _y2 = null

  constructor (...args) {
    super()
    switch (args.length) {
      case 0:
        this._x1 = this._y1 = this._x2 = this._y2 = 0
        break
      case 2:
        if ((typeof args[0]) === 'object' && (typeof args[1]) === 'object' && (args[0] instanceof geom.Point) && (args[1] instanceof geom.Point)) {
          let p1 = args[0]
          let p2 = args[1]
          this._x1 = p1.x()
          this._y1 = p1.y()
          this._x2 = p2.x()
          this._y2 = p2.y()
        }
        break
      case 4:
        if ((typeof args[0]) === 'number' && (typeof args[1]) === 'number' && (typeof args[2]) === 'number' && (typeof args[3]) === 'number') {
          this._x1 = args[0]
          this._y1 = args[1]
          this._x2 = args[2]
          this._y2 = args[3]
        }
        break
      default: break
    }
    if (this._x1 === null || this._y1 === null || this._x2 === null || this._y2 === null) throw new Error('Exception: Invalid geom.Line constructor arguments.')
  }

  x1 () { return this._x1 }
  y1 () { return this._y1 }
  x2 () { return this._x2 }
  y2 () { return this._y2 }

  length () {
    if ((typeof this._cachedProps['length']) === 'undefined') {
      this._cachedProps['length'] = Math.sqrt((this._x1 - this._x2) * (this._x1 - this._x2) + (this._y1 - this._y2) * (this._y1 - this._y2))
    }
    return this._cachedProps['length']
  }

  slope () {
    if ((typeof this._cachedProps['slope']) === 'undefined') {
      if (!geom.Util.epsilonEquals(this._x1, this._x2)) {
        this._cachedProps['slope'] = (this._y2 - this._y1) / (this._x2 - this._x1)
      }
      else {
        if (!geom.Util.epsilonEquals(this._y1, this._y2)) {
          this._cachedProps['slope'] = Infinity
        }
        else {
          this._cachedProps['slope'] = NaN
        }
      }
    }
    return this._cachedProps['slope']
  }

  x (y, asInfiniteLine) {
    asInfiniteLine = ((typeof asInfiniteLine) === 'undefined' ? false : asInfiniteLine)
    let x = null
    // if (Math.min(y1,y2) <= y && y <= Math.max(y1,y2)) {
    let minY = Math.min(this._y1, this._y2)
    let maxY = Math.max(this._y1, this._y2)
    if ((geom.Util.epsilonLe(minY, y) && geom.Util.epsilonLe(y, maxY)) || asInfiniteLine) {
      if (!geom.Util.epsilonEquals(this._y1, this._y2)) {
        x = (this._x2 - this._x1) / (this._y2 - this._y1) * (y - this._y1) + this._x1
      }
      else {
        // infinity many y values.
      }
    }
    return x
  }

  y (x, asInfiniteLine) {
    asInfiniteLine = ((typeof asInfiniteLine) === 'undefined' ? false : asInfiniteLine)
    let y = null
    let minX = Math.min(this._x1, this._x2)
    let maxX = Math.max(this._x1, this._x2)
    if ((geom.Util.epsilonLe(minX, x) && geom.Util.epsilonLe(x, maxX)) || asInfiniteLine) {
      if (!geom.Util.epsilonEquals(this._x1, this._x2)) {
        y = (this._y2 - this._y1) / (this._x2 - this._x1) * (x - this._x1) + this._y1
      }
      else {
        // infinity many y values.
      }
    }
    return y
  }

  shift (dx, dy) {
    return new geom.Line(this._x1 + dx, this._y1 + dy, this._x2 + dx, this._y2 + dy)
  }

  /*
    this.intersects = function (line) {
    let b = false
    if (geom.Util.epsilonEquals(x1, x2)) {
      if (geom.Util.epsilonEquals(line.x1(), line.x2())) {
        if (geom.Util.epsilonEquals(x1, line.x1())) {
          let L1 = this.length()
          let L2 = line.length()
          let L3 = (Math.max(y1, y2, line.y1(), line.y2()) - Math.min(y1, y2, line.y1(), line.y2()))
          b = geom.Util.epsilonLe(L3, (L1 + L2))
        }
      }
      else {
        let y = line.y(x1)
        if (y != null) {
          let minY = Math.min(y1, y2)
          let maxY = Math.max(y1, y2)
          // if (Math.min(y1, y2) <= y && y <= Math.max(y1, y2)) {
          if (geom.Util.epsilonLe(minY, y) && geom.Util.epsilonLe(y, maxY)) {
            b = true
          }
        }
      }
    }
    else {
      if (geom.Util.epsilonEquals(line.x1(), line.x2())) {
        let y = this.y(line.x1())
        if (y != null) {
          let minY = Math.min(line.y1(), line.y2())
          let maxY = Math.max(line.y1(), line.y2())
          if (geom.Util.epsilonLe(minY, y) && geom.Util.epsilonLe(y, maxY)) {
            b = true
          }
        }
      }
      else {
        let m1 = this.slope()
        let c1 = this.y(0, true) // this.yIntercept()
        let m2 = line.slope()
        let c2 = line.y(0, true) // line.yIntercept()
        let m = (m1 - m2)
        let c = (c1 - c2)
        let x = -c / m
        let minX = Math.min(line.x1(), line.x2())
        let maxX = Math.max(line.x1(), line.x2())
        // if (minX <= x && x <= maxX) {
        if (geom.Util.epsilonLe(minX, x) && geom.Util.epsilonLe(x, maxX)) {
          let y = this.y(x)
          if (y != null) {
            b = true
          }
        }
      }
    }
    return b
  };
  */

  /*
   * geom.IntersectionResult intersect(geom.Line line)
   */
  /*
    this.intersect = function (line) {
    let result = new geom.IntersectionResult(0, [])
    if (geom.Util.epsilonEquals(x1, x2)) {
      if (geom.Util.epsilonEquals(line.x1(), line.x2())) {
        if (geom.Util.epsilonEquals((x1 + x2) / 2, (line.x1() + line.x2()) / 2)) {
          // Return only if they're touching end-to-end.
          let L1 = this.length()
          let L2 = line.length()
          let minY = Math.min(y1, y2, line.y1(), line.y2())
          let maxY = Math.max(y1, y2, line.y1(), line.y2())
          let L3 = maxY - minY
          if (geom.Util.epsilonEquals(L1 + L2, L3)) {
            let Ys = [y1, y2, line.y1(), line.y2()];  // 1 of them is minY, 1 of them is maxY, and the rest of 2 should be epsilon equal.
            for (let i = 0; i < Ys.length; i++) {
              if (geom.Util.epsilonLt(minY, Ys[i])) {
                result = new geom.IntersectionResult(1, [new geom.Point(x1, Ys[i])])
                break
              }
            }
          }
          else {
            if (geom.Util.epsilonLt(L1 + L2, L3)) {
              result = new geom.IntersectionResult(0, [])
            }
            else {
              result = new geom.IntersectionResult(Infinity, null)
            }
          }
        }
      }
      else {
        let y = line.y(x1)
        if (y != null) {
          let minY = Math.min(y1, y2)
          let maxY = Math.max(y1, y2)
          if (geom.Util.epsilonLe(minY, y) && geom.Util.epsilonLe(y, maxY)) {
            result = new geom.IntersectionResult(1, [new geom.Point(x1, y)])
          }
        }
      }
    }
    else {
      if (geom.Util.epsilonEquals(line.x1(), line.x2())) {
        let y = this.y(line.x1())
        if (y != null) {
          let minY = Math.min(line.y1(), line.y2())
          let maxY = Math.max(line.y1(), line.y2())
          // if (Math.min(line.y1(), line.y2()) <= y && y <= Math.max(line.y1(), line.y2())) {
          if (geom.Util.epsilonLe(minY, y) && geom.Util.epsilonLe(y, maxY)) {
            result = new geom.IntersectionResult(1, [new geom.Point(line.x1(), y)])
          }
        }
      }
      else {
        let m1 = this.slope()
        let c1 = this.y(0, true) // this.yIntercept()
        let m2 = line.slope()
        let c2 = line.y(0, true) // line.yIntercept()
        let m = (m1 - m2)
        let c = (c1 - c2)
        let x = -c / m
        let minX = Math.min(line.x1(), line.x2())
        let maxX = Math.max(line.x1(), line.x2())
        // if (minX <= x && x <= maxX) {
        if (geom.Util.epsilonLe(minX, x) && geom.Util.epsilonLe(x, maxX)) {
          let y = this.y(x)
          if (y != null) {
            result = new geom.IntersectionResult(1, [new geom.Point(x, y)])
          }
        }
      }
    }
    return result
  };
  */

  getVector () {
    let x = this._x2 - this._x1
    let y = this._y2 - this._y1
    return new geom.Vector(x, y)
  }

  /*
   * boolean onSameSide(geom.Point p1, geom.Point p2)
   * boolean onSameSide(number x1, number y1, number x2, number y2)
   */
  onSameSide (...args) {
    let _x1 = null
    let _y1 = null
    let _x2 = null
    let _y2 = null
    switch (args.length) {
      case 2:
        if ((args[0] instanceof geom.Point) && (args[1] instanceof geom.Point)) {
          let p1 = args[0]
          let p2 = args[1]
          _x1 = p1.x()
          _y1 = p1.y()
          _x2 = p2.x()
          _y2 = p2.y()
        }
        break
      case 4:
        if ((typeof args[0]) === 'number' && (typeof args[1]) === 'number' && (typeof args[2]) === 'number' && (typeof args[3]) === 'number') {
          _x1 = args[0]
          _y1 = args[1]
          _x2 = args[2]
          _y2 = args[3]
        }
        break
      default: break
    }
    if (_x1 === null || _y1 === null || _x2 === null || _y2 === null) throw new Error('Exception: Invalid geom.Line.onSameSide arguments.')

    let ok = false
    if (geom.Util.epsilonEquals(this._x1, this._x2)) {
      if (this._x1 <= _x1 && this._x1 <= _x2) {
        ok = true
      }
      else
      if (_x1 <= this._x1 && _x2 <= this._x1) {
        ok = true
      }
    }
    else {
      let m = this.slope()
      // console.log('m = ' + m)
      let c = this.y(0, true) // this.yIntercept()
      let yy1 = m * _x1 + c
      let yy2 = m * _x2 + c
      if (_y1 <= yy1 && _y2 <= yy2) {
        ok = true
      }
      else
      if (yy1 <= _y1 && yy2 <= _y2) {
        ok = true
      }
    }
    return ok
  }

  equals (edge) {
    return (
      geom.Util.epsilonEquals(edge.x1(), this._x1) &&
      geom.Util.epsilonEquals(edge.y1(), this._y1) &&
      geom.Util.epsilonEquals(edge.x2(), this._x2) &&
      geom.Util.epsilonEquals(edge.y2(), this._y2)
    )
  }

  toString () {
    return '{(' + this._x1 + ', ' + this._y1 + '), (' + this._x2 + ', ' + this._y2 + ')}'
  }
}
// geom.Line.prototype = new geom.Shape
// geom.Line.prototype.constructor = geom.Shape

/*
 * geom.Polygon(geom.Edge[] edges)
 * geom.Polygon(geom.Point[] vertices)
 */
geom.Polygon = class extends geom.Shape {
  // Private fields ***

  _cachedProps = {}
  edges = null

  // *** Private fields

  // Constructor (before method overriding) ***

  constructor (...args) {
    super()
    // console.log('args: ', args)
    switch (args.length) {
      case 1:
        if ((typeof args[0]) === 'object') {
          if (args[0] instanceof Array) {
            if (args[0].length > 0) {
              if (args[0][0] instanceof geom.Line) {
                this.edges = args[0]
              }
              else
              if (args[0][0] instanceof geom.Point) {
                this.edges = []
                let vertices = args[0]
                for (let i = 0; i < vertices.length; i++) {
                  // console.log('i = ' + i)
                  let v1 = vertices[i]
                  let v2 = (i < vertices.length - 1 ? vertices[i + 1] : vertices[0])
                  let edge = new geom.LineEdge(v1.x(), v1.y(), v2.x(), v2.y())
                  // console.log('  edge = ' + edge.toString())
                  this.edges.push(edge)
                }
              }
            }
          }
        }
        break
      default: break
    }
    if (this.edges === null) throw new Error('Exception: Invalid geom.Polygon constructor arguments.')
    // _this.constructor(edges)
    this.normalize()
  }

  // *** Constructor (before method overriding)

  // Private methods ***

  normalize () {
    let debug = false

    if (debug) {
      console.log('Polygon.normalize:')
      let str = ''
      for (let i = 0; i < this.edges.length; i++) {
        str += (i > 0 ? ', ' : '') + this.edges[i].toString()
      }
      console.log('<before> new geom.Polygon(' + str + ')')
    }

    // Remove point edges
    for (let i = this.edges.length - 1; i > -1; i--) {
      if (geom.Util.epsilonEquals(this.edges[i].length(), 0)) {
        this.edges.splice(i, 1)
      }
    }

    // Combine split edges
    for (let i = 0; i < this.edges.length; i++) {
      let edge = this.edges[i]
      let Ue = edge.getVector().normalize()
      if (debug) console.log('i = ' + i + ': edge = ' + edge.toString())
      if (i < this.edges.length - 1) {
        let x2 = null
        let y2 = null
        let turned = false
        do {
          if (i < this.edges.length - 1) {
            let j = i + 1
            let edge2 = this.edges[j]
            let Ue2 = edge2.getVector().normalize()
            let cosineAngle = Ue.dot(Ue2)
            if (debug) console.log('  j = ' + j + ': edge = ' + edge2.toString() + ', cosineAngle = ' + cosineAngle)
            if (geom.Util.epsilonEquals(cosineAngle, 1)) {
              // console.log('combine ' + i + ':' + edge.toString() + ' and ' + j + ':' + edge2.toString() + ', cosineAngle = ' + cosineAngle)
              x2 = edge2.x2()
              y2 = edge2.y2()
              this.edges.splice(j, 1)
              if (debug) console.log('    combined, extend to (' + x2 + ', ' + y2 + '), edges.length = ' + this.edges.length)
            }
            else {
              turned = true
            }
          }
          else {
            let edge2 = this.edges[0]
            let Ue2 = edge2.getVector().normalize()
            let cosineAngle = Ue.dot(Ue2)
            if (geom.Util.epsilonEquals(cosineAngle, 1)) {
              let newEdge = new geom.LineEdge(edge.x1(), edge.y1(), edge2.x2(), edge2.y2())
              this.edges.splice(i, 1)
              this.edges.splice(0, 1, newEdge)
              x2 = null
              y2 = null
            }
            break
          }
        } while (!turned)
        if (x2 != null && y2 != null) {
          let newEdge = new geom.LineEdge(edge.x1(), edge.y1(), x2, y2)
          if (debug) console.log('  newEdge = ' + newEdge.toString())
          this.edges.splice(i, 1, newEdge)
        }
      }
      else {
        let edge2 = this.edges[0]
        let Ue2 = edge2.getVector().normalize()
        let cosineAngle = Ue.dot(Ue2)
        if (geom.Util.epsilonEquals(cosineAngle, 1)) {
          let newEdge = new geom.LineEdge(edge.x1(), edge.y1(), edge2.x2(), edge2.y2())
          this.edges.splice(i, 1)
          this.edges.splice(0, 1, newEdge)
        }
      }
    }

    if (debug) {
      let str = ''
      for (let i = 0; i < this.edges.length; i++) {
        str += (i > 0 ? ', ' : '') + this.edges[i].toString()
      }
      console.log('<after> new geom.Polygon(' + str + ')')
    }
  }

  sameSlope (slope1, slope2) {
    let ok = (
      ((slope1 === Infinity || slope1 === -Infinity) && (slope2 === Infinity || slope2 === -Infinity)) ||
      geom.Util.epsilonEquals(slope1, slope2)
    )
    return ok
  }

  // *** Private methods

  // Public methods ***

  countEdges () { return this.edges.length }
  edge (i) { return this.edges[i] }
  edges () { return this.edges }
  isPolygon () { return true }

  /*
   * number perimeter()
   */
  perimeter () {
    if ((typeof this._cachedProps['perimeter']) === 'undefined') {
      let length = 0
      for (let i = 0; i < this.edges.length; i++) {
        length += this.edges[i].length()
      }
      this._cachedProps['perimeter'] = length
    }
    return this._cachedProps['perimeter']
  }

  /*
   * number area()
   */
  area () {
    if ((typeof this._cachedProps['area']) === 'undefined') {
      let sum = 0
      for (let i = 0; i < this.edges.length; i++) {
        let edge = this.edges[i]
        sum += geom.Util.determinant(edge.x1(), edge.x2(), edge.y1(), edge.y2())
      }
      this._cachedProps['area'] = Math.abs(sum) / 2
    }
    return this._cachedProps['area']
  }

  /*
   * geom.Point centriod()
   */
  centriod () {
    if ((typeof this._cachedProps['centriod']) === 'undefined') {
      let area = this.area()
      let sum = {x: 0, y: 0}
      for (let i = 0; i < this.edges.length; i++) {
        let edge = this.edges[i]
        let det = geom.Util.determinant(edge.x1(), edge.x2(), edge.y1(), edge.y2())
        sum.x += (edge.x1() + edge.x2()) * det
        sum.y += (edge.y1() + edge.y2()) * det
      }
      let factor = 1 / (6 * area)
      let centriod = new geom.Point(
        Math.abs(factor * sum.x),
        Math.abs(factor * sum.y)
      )
      this._cachedProps['centriod'] = centriod
    }
    return this._cachedProps['centriod']
  }

  shift (dx, dy) {
    let newEdges = []
    for (let i = 0; i < this.edges.length; i++) {
      let edge = this.edges[i]
      let newX1 = edge.x1() + dx
      let newY1 = edge.y1() + dy
      let newX2 = edge.x2() + dx
      let newY2 = edge.y2() + dy
      // console.log('newX1 = ' + newX1 + ', newY1 = ' + newY1 + ', newX2 = ' + newX2 + ', newY2 = ' + newY2)
      let newEdge = new geom.LineEdge(newX1, newY1, newX2, newY2)
      newEdges.push(newEdge)
    }
    // console.log('newEdges = ' + JSON.stringify(newEdges))
    return new geom.Polygon(newEdges)
  }

  rotate (...args) {
    let angle = null
    let rotateAbout = null
    switch (args.length) {
      case 2:
        if ((typeof args[0]) === 'number' && (args[1] instanceof geom.Point)) {
          angle = args[0]
          rotateAbout = args[1]
        }
        break
      case 1:
        if ((typeof args[0]) === 'number') {
          angle = args[0]
          rotateAbout = this.centriod()
        }
        break
      default: break
    }
    if (angle === null || rotateAbout === null) throw new Error('Exception: Invalid geom.Polygon.rotate() method arguments.')

    let R = [
      [Math.cos(angle), -Math.sin(angle)],
      [Math.sin(angle), Math.cos(angle)]
    ]
    let cx = rotateAbout.x()
    let cy = rotateAbout.y()

    let vertices = []
    for (let i = 0; i < this.edges.length; i++) {
      let x = this.edges[i].x1()
      let y = this.edges[i].y1()
      let newX = R[0][0] * (x - cx) + R[0][1] * (y - cy)
      let newY = R[1][0] * (x - cx) + R[1][1] * (y - cy)
      vertices.push(new geom.Point(newX, newY))
    }
    return new geom.Polygon(vertices)
  }

  flip (...args) {
    let flipAlong = null
    switch (args.length) {
      case 1:
        if (args[0] instanceof geom.Line) {
          flipAlong = args[0]
        }
        break
      default: break
    }
    if (flipAlong === null) throw new Error('Exception: Invalid geom.Polygon.flip() method arguments.')
  }

  clockwiseInitialized = false
  initClockwise = function () {
    if (!this.clockwiseInitialized) {
      let sumOfAngle = 0
      let n = this.edges.length
      for (let i = 0; i < n; i++) {
        let edge1 = this.edges[i % n]
        let edge2 = this.edges[(i + 1) % n]
        let v1 = edge1.getVector()
        let v2 = edge2.getVector()
        let angle = v1.angleTo(v2)
        // console.log('angle[' + i + '] = ' + angle + ' radian, ' + (180 * angle / Math.PI) + ' degree.')
        sumOfAngle += angle
      }
      // console.log(sumOfAngle + ' radian, ' + (180 * sumOfAngle / Math.PI) + ' degree.')
      this._cachedProps['isClockwise'] = geom.Util.epsilonEquals(sumOfAngle, 2 * Math.PI)
      this._cachedProps['isCounterClockwise'] = geom.Util.epsilonEquals(sumOfAngle, -2 * Math.PI)
      this.clockwiseInitialized = true
    }
  }

  /*
   * boolean isClockwise()
   */
  isClockwise () {
    this.initClockwise()
    return this._cachedProps['isClockwise']
  }

  /*
   * boolean isCounterClockwise()
   */
  isCounterClockwise () {
    this.initClockwise()
    return this._cachedProps['isCounterClockwise']
  }

  /*
   * boolean contains(geom.Point p)
   * boolean contains(number x, number y)
   */
  contains (...args) {
    let px = null
    let py = null
    switch (args.length) {
      case 1:
        if (args[0] instanceof geom.Point) {
          let p = args[0]
          px = p.x()
          py = p.y()
        }
        break
      case 2:
        if ((typeof args[0]) === 'number' && (typeof args[1]) === 'number') {
          px = args[0]
          py = args[1]
        }
        break
      default: break
    }
    if (px === null || py === null) throw new Error('Exception: Invalid geom.Polygon.contains() method arguments.')

    let sumOfAngle = 0
    let n = this.edges.length
    for (let i = 0; i < n; i++) {
      let edge1 = this.edges[i]
      let v1 = new geom.Vector(edge1.x1() - px, edge1.y1() - py)
      let v2 = new geom.Vector(edge1.x2() - px, edge1.y2() - py)
      let angle = v1.angleTo(v2)
      // console.log('angle[' + i + '] = ' + angle + ' radian, ' + (180 * angle / Math.PI) + ' degree.')
      if (!isNaN(angle)) {
        sumOfAngle += angle
      }
    }
    // console.log('sumOfAngle = ' + sumOfAngle + ' radian, ' + (180 * sumOfAngle / Math.PI) + ' degree.')
    let b = geom.Util.epsilonEquals(Math.abs(sumOfAngle), 2 * Math.PI)
    return b
  }

  /*
   * boolean intersects(geom.Polygon shape)
   */
  intersects (shape) {
    let b = false
    if (!b) {
      // Check if the vertices of this object lies inside shape.
      for (let i = 0; i < this.edges.length; i++) {
        if (shape.contains(this.edges[i].x1(), this.edges[i].y1())) {
          b = true
          break
        }
      }
    }
    if (!b) {
      // Check if the vertices of shape lies inside this object.
      let shapeEdges = shape.edges()
      for (let i = 0; i < shapeEdges.length; i++) {
        if (this.contains(shapeEdges[i].x1(), shapeEdges[i].y1())) {
          b = true
          break
        }
      }
    }
    if (!b) {
      // Check if any edges crossed. (e.g. two rectangles placed like a "+" sign. No vertices of one object lies within the others, but they are overlapped)
      let shapeEdges = shape.edges()
      for (let i = 0; i < this.edges.length; i++) {
        for (let j = 0; j < shapeEdges.length; j++) {
          /*
          let intersection = edges[i].intersect(shapeEdges[j])
          if (intersection != null) {
            console.log('>>>>')
            b = true
            break
          }
          */
          if (this.edges[i].intersects(shapeEdges[j])) {
            b = true
            break
          }
        }
      }
    }
    return b
  }

  /*
   * geom.Shape[] cut(geom.Line cuttingLine)
   *
   * - 2 ends of the cutting line cannot lies inside the polygon.

      if the intersection is a "normal" cross, then ok.

      if the line is cut on a vertex
          if the 2 edges are on the same sides of the cutting line
              If cut from exterior
                  ignore the intersection
              otherwise
                  ok, choose both intersections
          otherwise
              ok, choose either one intersection

      if the ends of the cutting line touch on edge.
          if cut into the polygon
              ok
          else
              ignore the intersection
   */
  cut (cuttingLine) {
    let debug = false || (!!geom._flags['geom.Polygon.cut.debug'])

    if (debug) {
      console.log('cutShape:')
      // Vertices
      console.log('  vertices:')
      let verticesstr = ''
      for (let i = 0; i < this.edges.length; i++) {
        verticesstr += (i > 0 ? ', ' : '') + 'v' + i + ':(' + this.edges[i].x1() + ', ' + this.edges[i].y1() + ')'
      }
      console.log('    ' + verticesstr)
      // Edges
      console.log('  edges.length = ' + this.edges.length)
      let edgeLengths = ''
      for (let i = 0; i < this.edges.length; i++) {
        edgeLengths += (i > 0 ? ', ' : '') + this.edges[i].length()
      }
      console.log('  edge lengths = ' + edgeLengths)
      console.log('  cutting line = ' + cuttingLine.toString())
    }

    // Find intersections
    let intersections = []
    for (let i = 0; i < this.edges.length; i++) {
      let edge = this.edges[i]
      if (debug) console.log('  edge(' + i + ') = ' + edge.toString())
      // let intersections_i = edge.intersect(cuttingLine)
      // for (let j = 0; j < intersections_i.length; j++) {
      //   let intersection = intersections_i[j]
      let intersectionResult = edge.intersect(cuttingLine)
      // if (debug) console.log('    intersection = ' + (intersection != null ? intersection.toString() : null))
      if (intersectionResult.getNumberOfIntersections() === 1) {
        let intersection = intersectionResult.getIntersections()[0]
        let ok = true
        let verticesIntersectionCheck = true
        if (ok) {
          // Exclude the intersection that only touch on the vertex from exterior.
          if (geom.Util.epsilonEquals(intersection.x(), edge.x1()) && geom.Util.epsilonEquals(intersection.y(), edge.y1())) {
            // if (debug) console.log('  >>>1')
            let prevEdge = this.edges[(i > 0 ? i - 1 : this.edges.length - 1)]
            if (cuttingLine.onSameSide(prevEdge.x1(), prevEdge.y1(), edge.x2(), edge.y2())) {
              let interiorAngles = this.getInteriorAngles()
              if (interiorAngles[i] < Math.PI) {
                if (debug) console.log('      touch on vertices (a) - dropped')
                ok = false
              }
              else {
                // Skip the vertices intersection check to keep the intersections on both edges in order to prevent odd number of intersections.
                // But an edge may be split into two edges that need to combine again.
                verticesIntersectionCheck = false
              }
            }
          }
        }
        if (ok) {
          // Exclude the intersection that only touch on the vertex from exterior.
          if (geom.Util.epsilonEquals(intersection.x(), edge.x2()) && geom.Util.epsilonEquals(intersection.y(), edge.y2())) {
            // if (debug) console.log('  >>>2')
            let nextEdgeIdx = (i < this.edges.length - 1 ? i + 1 : 0)
            let nextEdge = this.edges[nextEdgeIdx]
            if (cuttingLine.onSameSide(edge.x1(), edge.y1(), nextEdge.x2(), nextEdge.y2())) {
              let interiorAngles = this.getInteriorAngles()
              if (interiorAngles[nextEdgeIdx] < Math.PI) {
                if (debug) console.log('      touch on vertices (b) - dropped')
                ok = false
              }
              else {
                // Skip the vertices intersection check to keep the intersections on both edges in order to prevent odd number of intersections.
                // But an edge may be split into two edges that need to combine again.
                verticesIntersectionCheck = false
              }
            }
          }
        }
        if (ok) {
          if (geom.Util.epsilonEquals(intersection.x(), cuttingLine.x1()) && geom.Util.epsilonEquals(intersection.y(), cuttingLine.y1())) {
            let Vi = cuttingLine.getVector().negate() // The vector is pointing to the edge.
            let Ve = edge.getVector()
            let crossProduct = Ve.cross(Vi)
            // console.log('Ve x Vi = ' + crossProduct.toString())
            let direction = crossProduct.get(2)
            if (geom.Util.epsilonEquals(direction, 0)) {
              if (debug) console.log('      XXX - dropped')
              ok = false
            }
            else {
              direction = (direction < 0 ? -1 : 1)
              if (this.isClockwise()) direction = -direction
              if (direction < 0) {
                if (debug) console.log('      start of cutting line touch on edge from exterior - dropped')
                ok = false
              }
            }
          }
        }
        if (ok) {
          if (geom.Util.epsilonEquals(intersection.x(), cuttingLine.x2()) && geom.Util.epsilonEquals(intersection.y(), cuttingLine.y2())) {
            let Vi = cuttingLine.getVector() // The vector is pointing to the edge.
            let Ve = edge.getVector()
            let crossProduct = Ve.cross(Vi)
            // console.log('Ve x Vi = ' + crossProduct.toString())
            let direction = crossProduct.get(2)
            if (geom.Util.epsilonEquals(direction, 0)) {
              if (debug) console.log('      YYY - dropped')
              ok = false
            }
            else {
              direction = (direction < 0 ? -1 : 1)
              if (this.isClockwise()) direction = -direction
              if (direction < 0) {
                if (debug) console.log('      end of cutting line touch on edge from exterior - dropped')
                ok = false
              }
            }
          }
        }
        if (ok) {
          if (verticesIntersectionCheck) {
            // If the intersection intersects on one edge end, it must intersects on the neighbour's edge end, include only one of them.
            // (Include only the intersection that intersects on the start of the edge in this case.)
            if (geom.Util.epsilonEquals(intersection.x(), edge.x2()) && geom.Util.epsilonEquals(intersection.y(), edge.y2())) {
              if (debug) console.log('      intersection at the end of line - dropped')
              ok = false
            }
          }
        }
        if (ok) {
          intersections.push({
            intersection: intersection,
            edge: edge,
            edgeIndex: i
          })
        }
      }
    }
    if (debug) {
      let intersectionstr = '['
      for (let i = 0; i < intersections.length; i++) {
        intersectionstr += (i > 0 ? ', ' : '') + intersections[i].intersection.toString()
      }
      intersectionstr += ']'
      console.log('intersections: ' + intersectionstr)
    }
    if ((intersections.length % 2) === 1) {
      // console.log('Exception : Odd number of intersections - ' + intersections.length + '.')
      throw new Error('Exception : Odd number of intersections - ' + intersections.length + '.')
      /*
      for (let i = 0; i < intersections.length; i++) {
        console.log('  ' + intersections[i].intersection.toString() + ' on edge ' + intersections[i].edgeIndex + ': ' + intersections[i].edge.toString())
      }
      */
    }

    let newShapes = null
    if (intersections.length > 0 && (intersections.length % 2) === 0) {
      // Sort intersections
      intersections.sort(function (p1, p2) {
        let d1 = geom.Util.distance(cuttingLine.x1(), cuttingLine.y1(), p1.intersection.x(), p1.intersection.y())
        let d2 = geom.Util.distance(cuttingLine.x1(), cuttingLine.y1(), p2.intersection.x(), p2.intersection.y())
        let cmpValue = (d1 - d2)
        if (cmpValue === 0) {
          cmpValue = (p1.edgeIndex - p2.edgeIndex)
        }
        return cmpValue
      })

      newShapes = []
      let edgesList = [this.edges]
      // console.log('intersections.length = ' + intersections.length)
      for (let i = 0; i < intersections.length; i += 2) {
        let p1 = intersections[i]
        let p2 = intersections[i + 1]
        // console.log('p1', p1, 'p2', p2)

        let nextEdgesList = []
        for (let j = 0; j < edgesList.length; j++) {
          let subEdges = edgesList[j]

          let edgeIndex1 = -1
          let edgeIndex2 = -1
          for (let e = 0; e < subEdges.length; e++) {
            if (edgeIndex1 === -1 && subEdges[e] === p1.edge) {
              edgeIndex1 = e
            }
            else
            if (edgeIndex2 === -1 && subEdges[e] === p2.edge) {
              edgeIndex2 = e
            }
            if (edgeIndex1 > -1 && edgeIndex2 > -1) break
          }
          if (edgeIndex1 === -1 || edgeIndex2 === -1) {
            console.log('Exception : edgeIndex1=' + edgeIndex1 + ', edgeIndex2=' + edgeIndex2)
          }

          let edgeIndexItr = null

          // console.log('edgeSet1:')
          let edgeSet1 = []
          let moreIntersections1 = false
          edgeSet1.push(new geom.LineEdge(p1.intersection.x(), p1.intersection.y(), p2.intersection.x(), p2.intersection.y()))
          edgeIndexItr = new util.IntegerIterator(edgeIndex2, edgeIndex1, 0, subEdges.length - 1)
          while (edgeIndexItr.hasNext()) {
            let e = edgeIndexItr.next()
            if (e === edgeIndex2) {
              if (e === edgeIndex1) { // Intersects the same edge two times. Impossible for striaght line.
              }
              else {
                let edge = new geom.LineEdge(p2.intersection.x(), p2.intersection.y(), subEdges[e].x2(), subEdges[e].y2())
                if (edge.length() > 0) {
                  edgeSet1.push(edge)
                }
              }
            }
            else
            if (e === edgeIndex1) {
              let edge = new geom.LineEdge(subEdges[e].x1(), subEdges[e].y1(), p1.intersection.x(), p1.intersection.y())
              if (edge.length() > 0) {
                edgeSet1.push(edge)
              }
            }
            else {
              edgeSet1.push(subEdges[e])
              if (!moreIntersections1) {
                for (let k = 0; k < intersections.length; k++) {
                  if (intersections[k].edge === subEdges[e]) {
                    moreIntersections1 = true
                    break
                  }
                }
              }
            }
          }
          // console.log('edgeSet1 = ' + edgeSet1)

          let edgeSet2 = []
          let moreIntersections2 = false
          edgeSet2.push(new geom.LineEdge(p2.intersection.x(), p2.intersection.y(), p1.intersection.x(), p1.intersection.y()))
          edgeIndexItr = new util.IntegerIterator(edgeIndex1, edgeIndex2, 0, subEdges.length - 1)
          while (edgeIndexItr.hasNext()) {
            let e = edgeIndexItr.next()
            if (e === edgeIndex1) {
              if (e === edgeIndex2) { // Intersects the same edge two times. Impossible for striaght line.
              }
              else {
                let edge = new geom.LineEdge(p1.intersection.x(), p1.intersection.y(), subEdges[e].x2(), subEdges[e].y2())
                if (edge.length() > 0) {
                  edgeSet2.push(edge)
                }
              }
            }
            else
            if (e === edgeIndex2) {
              let edge = new geom.LineEdge(subEdges[e].x1(), subEdges[e].y1(), p2.intersection.x(), p2.intersection.y())
              if (edge.length() > 0) {
                edgeSet2.push(edge)
              }
            }
            else {
              edgeSet2.push(subEdges[e])
              if (!moreIntersections2) {
                for (let k = 0; k < intersections.length; k++) {
                  if (intersections[k].edge === subEdges[e]) {
                    moreIntersections2 = true
                    break
                  }
                }
              }
            }
          }
          // console.log('edgeSet2 = ' + edgeSet2)

          // console.log('moreIntersections1=' + moreIntersections1 + ', moreIntersections2=' + moreIntersections1)
          if (!moreIntersections1) {
            if (edgeSet1.length > 2) {
              newShapes.push(new geom.Polygon(edgeSet1))
            }
          }
          else {
            nextEdgesList.push(edgeSet1)
          }
          if (!moreIntersections2) {
            if (edgeSet2.length > 2) {
              newShapes.push(new geom.Polygon(edgeSet2))
            }
          }
          else {
            nextEdgesList.push(edgeSet2)
          }
        }
        edgesList = nextEdgesList
      }
    }

    return newShapes
  }

  //
  // for triangles
  //

  isEquilateralTriangle () {
    if ((typeof this._cachedProps['isEquilateralTriangle']) === 'undefined') {
      let ok = false
      if (this.edges.length === 3) {
        ok = this.isRegular()
      }
      this._cachedProps['isEquilateralTriangle'] = ok
    }
    return this._cachedProps['isEquilateralTriangle']
  }
  isEquilateral () { return this.isEquilateralTriangle() }

  isIsoscelesTriangle () {
    // two sides are equal in length.
    if ((typeof this._cachedProps['isIsoscelesTriangle']) === 'undefined') {
      let ok = false
      if (this.edges.length === 3) {
        let lengths = []
        for (let i = 0; i < this.edges.length; i++) {
          lengths.push(this.edges[i].length())
        }
        ok = (
          geom.Util.epsilonEquals(lengths[0], lengths[1]) ||
          geom.Util.epsilonEquals(lengths[0], lengths[2]) ||
          geom.Util.epsilonEquals(lengths[1], lengths[2])
        )
      }
      this._cachedProps['isIsoscelesTriangle'] = ok
    }
    return this._cachedProps['isIsoscelesTriangle']
  }
  isIsosceles () { return this.isIsoscelesTriangle() }

  isRightAngledTriangle () {
    if ((typeof this._cachedProps['isRightAngledTriangle']) === 'undefined') {
      let ok = false
      if (this.edges.length === 3) {
        for (let i = 0; i < this.edges.length; i++) {
          let edge1 = this.edges[i]
          let edge2 = this.edges[i < this.edges.length - 1 ? i + 1 : 0]
          let v1 = edge1.getVector().negate()
          let v2 = edge2.getVector()
          let dotProduct = v1.dot(v2)
          if (geom.Util.epsilonEquals(dotProduct, 0)) {
            ok = true
            break
          }
        }
      }
      this._cachedProps['isRightAngledTriangle'] = ok
    }
    return this._cachedProps['isRightAngledTriangle']
  }
  isRightAngled () { return this.isRightAngledTriangle() }

  //
  // for quadrilateral
  //

  quadrilateralSpecialCasesInitialized = false
  initQuadrilateralSpecialCases = function () {
    if (!this.quadrilateralSpecialCasesInitialized) {
      let isTrapezoid = false
      let isIsoscelesTrapezoid = false
      let isRightAngledTrapezoid = false
      let isParallelogram = false
      let isRectangle = false
      let isRhombus = false
      if (this.edges.length === 4) {
        let slopes = []
        let lengths = []
        let angles = []
        let minLength = null
        let maxLength = null
        for (let i = 0; i < this.edges.length; i++) {
          let e1 = this.edges[i]
          let e2 = this.edges[i < this.edges.length - 1 ? i + 1 : 0]
          let L1 = e1.length()
          let u1 = e1.getVector().negate().normalize()
          let u2 = e2.getVector().normalize()
          let cosineAngle = u1.dot(u2)
          slopes.push(e1.slope())
          lengths.push(L1)
          angles.push(cosineAngle)
          if (minLength === null || L1 < minLength) minLength = L1
          if (maxLength === null || maxLength < L1) maxLength = L1
        }
        // console.log('slopes = ' + JSON.stringify(slopes))
        isTrapezoid = (
          this.sameSlope(slopes[0], slopes[2]) ||
          this.sameSlope(slopes[1], slopes[3])
        )
        isIsoscelesTrapezoid = (
          (this.sameSlope(slopes[0], slopes[2]) && geom.Util.epsilonEquals(lengths[1], lengths[3])) ||
          (this.sameSlope(slopes[1], slopes[3]) && geom.Util.epsilonEquals(lengths[0], lengths[2]))
        )
        isRightAngledTrapezoid = (
          (this.sameSlope(slopes[0], slopes[2]) || this.sameSlope(slopes[1], slopes[3])) &&
          (geom.Util.epsilonEquals(angles[0], 0) || geom.Util.epsilonEquals(angles[1], 0) || geom.Util.epsilonEquals(angles[2], 0) || geom.Util.epsilonEquals(angles[3], 0))
        )
        isParallelogram = (
          (this.sameSlope(slopes[0], slopes[2]) && this.sameSlope(slopes[1], slopes[3]))
        )
        isRectangle = (
          (this.sameSlope(slopes[0], slopes[2]) && this.sameSlope(slopes[1], slopes[3])) &&
          (geom.Util.epsilonEquals(angles[0], 0) && geom.Util.epsilonEquals(angles[1], 0) && geom.Util.epsilonEquals(angles[2], 0) && geom.Util.epsilonEquals(angles[3], 0))
        )
        isRhombus = (
          geom.Util.epsilonEquals(minLength, maxLength)
        )
      }
      this._cachedProps['isTrapezoid'] = isTrapezoid
      this._cachedProps['isIsoscelesTrapezoid'] = isIsoscelesTrapezoid
      this._cachedProps['isRightAngledTrapezoid'] = isRightAngledTrapezoid
      this._cachedProps['isParallelogram'] = isParallelogram
      this._cachedProps['isRectangle'] = isRectangle
      this._cachedProps['isRhombus'] = isRhombus
      this.quadrilateralSpecialCasesInitialized = true
    }
  }

  isTrapezoid () {
    // at least one pair of parallel sides
    /*
    if ((typeof _cachedProps['isTrapezoid']) === 'undefined') {
    }
    */
    this.initQuadrilateralSpecialCases()
    return this._cachedProps['isTrapezoid']
  }

  isIsoscelesTrapezoid () {
    /*
    if ((typeof _cachedProps['isIsoscelesTrapezoid']) === 'undefined') {
    }
    */
    this.initQuadrilateralSpecialCases()
    return this._cachedProps['isIsoscelesTrapezoid']
  }

  isRightAngledTrapezoid () {
    this.initQuadrilateralSpecialCases()
    return this._cachedProps['isRightAngledTrapezoid']
  }

  isParallelogram () {
    // with two pairs of parallel sides.
    this.initQuadrilateralSpecialCases()
    return this._cachedProps['isParallelogram']
  }

  isRectangle () {
    this.initQuadrilateralSpecialCases()
    return this._cachedProps['isRectangle']
  }

  isRhombus () {
    // four sides all have the same length.
    this.initQuadrilateralSpecialCases()
    return this._cachedProps['isRhombus']
  }

  isSquare () {
    if ((typeof this._cachedProps['isSquare']) === 'undefined') {
      let ok = false
      if (this.edges.length === 4) {
        ok = this.isRegular()
      }
      this._cachedProps['isSquare'] = ok
    }
    return this._cachedProps['isSquare']
  }

  //
  // for n-gon
  //

  isRegular () {
    if ((typeof this._cachedProps['isRegular']) === 'undefined') {
      let ok = false
      if (this.edges.length > 2) {
        let minLength = null
        let maxLength = null
        let minAngle = null
        let maxAngle = null
        for (let i = 0; i < this.edges.length; i++) {
          let edge1 = this.edges[i]
          let edge2 = this.edges[i < this.edges.length - 1 ? i + 1 : 0]
          let L = edge1.length()
          // console.log('L = ' + L)
          if (minLength === null || L < minLength) minLength = L
          if (maxLength === null || maxLength < L) maxLength = L
          let u1 = edge1.getVector().negate().normalize()
          let u2 = edge2.getVector().normalize()
          let cosineAngle = u1.dot(u2)
          if (minAngle === null || cosineAngle < minAngle) minAngle = cosineAngle
          if (maxAngle === null || maxAngle < cosineAngle) maxAngle = cosineAngle
        }
        if (minLength != null && maxLength != null && minAngle != null && maxAngle != null) {
          ok = geom.Util.epsilonEquals(minLength, maxLength) && geom.Util.epsilonEquals(minAngle, maxAngle)
        }
      }
      this._cachedProps['isRegular'] = ok
    }
    return this._cachedProps['isRegular']
  }

  isConvex () {
    if ((typeof this._cachedProps['isConvex']) === 'undefined') {
      let sgn = 0
      for (let i = 0; i < this.edges.length; i++) {
        let edge1 = this.edges[i]
        let edge2 = this.edges[i < this.edges.length - 1 ? i + 1 : 0]
        let u1 = edge1.getVector().negate().normalize()
        let u2 = edge2.getVector().normalize()
        let angle = u1.angleTo(u2)
        if (sgn === 0) {
          sgn = (angle < 0 ? -1 : 1)
        }
        else {
          sgn *= (angle < 0 ? -1 : 1)
        }
      }
      this._cachedProps['isConvex'] = (sgn === 1)
    }
    return this._cachedProps['isConvex']
  }

  isConcave () {
    return !this.isConvex()
  }

  getInteriorAngles () {
    if ((typeof this._cachedProps['getInteriorAngles']) === 'undefined') {
      let angles = []
      let isClockwise = this.isClockwise()
      for (let i = 0; i < this.edges.length; i++) {
        let edge1 = this.edges[(i === 0 ? this.edges.length - 1 : i - 1)]
        let edge2 = this.edges[i]
        let u1 = edge1.getVector().negate().normalize()
        let u2 = edge2.getVector().normalize()
        // let cosineAngle = u1.dot(u2)
        // let angle = Math.acos(cosineAngle)
        let angle = u1.angleTo(u2)
        if (isClockwise) {
          if (angle > 0) {
            angle = 2 * Math.PI - angle
          }
        }
        else {
          if (angle < 0) {
            angle = 2 * Math.PI + angle
          }
        }
        angles.push(angle)
        // console.log('angle ' + i + ' : ' + angle + ' rad, ' + (180 * angle / Math.PI) + ' deg.')
      }
      this._cachedProps['getInteriorAngles'] = angles
    }
    return this._cachedProps['getInteriorAngles']
  }

  toString () {
    let str = ''
    str += 'vertices={'
    for (let i = 0; i < this.edges.length; i++) {
      if (i > 0) str += ', '
      str += '(' + this.edges[i].x1() + ', ' + this.edges[i].y1() + ')'
    }
    str += '}, '
    str += 'area=' + this.area()
    return str
  }

  // *** Public methods

  // Constructor (after method overriding) ***

  // normalize()

  // *** Constructor (after method overriding)
}
// geom.Polygon.prototype = new geom.Shape
// geom.Polygon.prototype.constructor = geom.Shape
// geom.Polygon.prototype.constructor = function () { console.log('HI') }
// geom.Polygon.constructor = geom.Shape.prototype.constructor

/*
 * geom.Edge
 */
geom.Edge = class extends geom.Object {
}
// geom.Edge.prototype = new geom.Object
// geom.Edge.prototype.constructor = geom.Object

/*
 * geom.LineEdge
 */
geom.LineEdge = class extends geom.Line {
  constructor (...args) {
    // super(args)
    switch (args.length) {
      case 0:
        super()
        break
      case 2:
        super(args[0], args[1])
        break
      case 4:
        super(args[0], args[1], args[2], args[3])
        break
      default:
        throw new Error('Exception: Invalid geom.LineEdge constructor arguments.')
    }
  }
}
// geom.LineEdge.prototype = new geom.Line
// geom.LineEdge.prototype.constructor = geom.Line

/*
 * geom.Arc(number cx, number cy, number radius, number startAngle, number endAngle)
 */
geom.Arc = class extends geom.Shape {
  _cachedProps = {}
  cx = null
  cy = null
  radius = null
  startAngle = null
  endAngle = null

  constructor (...args) {
    super()
    switch (args.length) {
      case 0:
        this.cx = this.cy = this.radius = this.startAngle = this.endAngle = 0
        break
      case 5:
        if ((typeof args[0]) === 'number' && (typeof args[1]) === 'number' && (typeof args[2]) === 'number' && (typeof args[3]) === 'number' && (typeof arguments[4]) === 'number') {
          this.cx = args[0]
          this.cy = args[1]
          this.radius = args[2]
          this.startAngle = args[3]
          this.endAngle = args[4]
        }
        break
      default: break
    }
    if (this.cx === null || this.cy === null || this.radius === null || this.startAngle === null || this.endAngle === null) throw new Error('Exception: Invalid geom.Arc constructor arguments.')
  }

  cx () { return this.cx }
  cy () { return this.cy }
  radius () { return this.radius }
  startAngle () { return this.startAngle }
  endAngle () { return this.endAngle }

  length () {
    if ((typeof this._cachedProps['length']) === 'undefined') {
      this._cachedProps['length'] = this.radius * (this.endAngle - this.startAngle)
    }
    return this._cachedProps['length']
  }

  shift (dx, dy) {
    return new geom.Arc(this.cx + dx, this.cy + dy, this.radius, this.startAngle, this.endAngle)
  }

  rotate (angle) {
    return new geom.Arc(this.cx, this.cy, this.radius, this.startAngle + angle, this.endAngle + angle)
  }
}

geom.test = geomtest

// geom.Arc.prototype = new geom.Shape
// geom.Arc.prototype.constructor = geom.Shape

export default geom
