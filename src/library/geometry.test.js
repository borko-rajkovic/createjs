
import geom from './geometry.js'

function geomtest () {
  let noUI = !false

  let cuttingLine = null
  let shapes = []

  let getRandomColor = function () { return null }
  let refreshCanvas = function () {}

  let cutShape = function (shape) {
    let _newShapes = shape.cut(cuttingLine)
    // console.log('new shapes = ', _newShapes)
    let newShapes = null
    if (_newShapes != null) {
      newShapes = []
      for (let i = 0; i < _newShapes.length; i++) {
        newShapes.push({
          shape: _newShapes[i],
          color: getRandomColor()
        })
      }
    }
    return newShapes
  }

  let cutShapes = function () {
    let n = shapes.length
    // console.log('before cut n = ' + n)
    for (let i = 0; i < n; i++) {
      let newShapes = cutShape(shapes[i].shape)
      if (newShapes != null) {
        shapes[i] = null
        for (let j = 0; j < newShapes.length; j++) {
          shapes.push(newShapes[j])
        }
      }
    }
    // console.log('after cut (1) n shapes.length ' + shapes.length)
    for (let i = shapes.length - 1; i > -1; i--) {
      if (shapes[i] === null) {
        shapes.splice(i, 1)
      }
    }
    // console.log('after cut (2) n shapes.length ' + shapes.length)
    refreshCanvas()
  }

  let assert = function (message, b) {
    if (b) {
      console.log(message + ' [Passed]')
    }
    else {
      // throw new Error('AssertionException: ' + $.trim(message))
      throw new Error('AssertionException: ' + (message))
    }
  }

  let clear = function () {
    if (!noUI) {
      document.getElementById('clear').click()
    }
    else {
      cuttingLine = null
      shapes = []
    }
  }

  let check = function (elementId, b) {
    if (!noUI) {
      document.getElementById(elementId).checked = !b
      document.getElementById(elementId).click()
    }
  }

  let setTextField = function (elementId, value) {
    if (!noUI) {
      document.getElementById(elementId).value = value
    }
  }

  let midPoint = function (p1, p2) {
    let x = (p1.x() + p2.x()) / 2
    let y = (p1.y() + p2.y()) / 2
    return new geom.Point(x, y)
  }

  let cut = function (line) {
    cuttingLine = line
    cutShapes()
    cuttingLine = null
  }

  let shapesStats = function (shapes) {
    // Using the exclusive definition.
    let stats = {
      triangle: 0,
      rightAngledTriangle: 0,
      isoscelesTriangle: 0,
      rightAngledIsoscelesTriangle: 0,
      equilateralTriangle: 0,
      trapezoid: 0,
      isoscelesTrapezoid: 0,
      rightAngledTrapezoid: 0,
      parallelogram: 0,
      rectangle: 0,
      rhombus: 0,
      square: 0,
      pentagon: 0,
      regularPentagon: 0,
      hexagon: 0,
      regularHexagon: 0,
      others: {},
      total: 0
    }

    for (let i = 0; i < shapes.length; i++) {
      let shape = shapes[i].shape
      let noOfEdge = shape.countEdges()

      // 3
      let isTriangle = (noOfEdge === 3)
      let isRightAngledTriangle = shape.isRightAngledTriangle()
      let isIsoscelesTriangle = shape.isIsoscelesTriangle()
      let isEquilateralTriangle = shape.isEquilateralTriangle()
      // 4
      let isTrapezoid = shape.isTrapezoid()
      let isIsoscelesTrapezoid = shape.isIsoscelesTrapezoid()
      let isRightAngledTrapezoid = shape.isRightAngledTrapezoid()
      let isParallelogram = shape.isParallelogram()
      let isRectangle = shape.isRectangle()
      let isRhombus = shape.isRhombus()
      let isSquare = shape.isSquare()
      // 5
      let isPentagons = (noOfEdge === 5)
      // 6
      let isHexagon = (noOfEdge === 6)
      //
      let isRegular = shape.isRegular()

      if (isTriangle) {
        if (isEquilateralTriangle) {
          stats.equilateralTriangle++
        }
        else if (isIsoscelesTriangle) {
          if (isRightAngledTriangle) {
            stats.rightAngledIsoscelesTriangle++
          }
          else {
            stats.isoscelesTriangle++
          }
        }
        else {
          if (isRightAngledTriangle) {
            stats.rightAngledTriangle++
          }
          else {
            stats.triangle++
          }
        }
      }
      if (isSquare) {
        stats.square++
      }
      else if (isRhombus) {
        stats.rhombus++
      }
      else if (isRectangle) {
        stats.rectangle++
      }
      else if (isParallelogram) {
        stats.parallelogram++
      }
      else if (isRightAngledTrapezoid) {
        stats.rightAngledTrapezoid++
      }
      else if (isIsoscelesTrapezoid) {
        stats.isoscelesTrapezoid++
      }
      else if (isTrapezoid) {
        stats.trapezoid++
      }
      if (isPentagons) {
        if (isRegular) {
          stats.regularPentagon++
        }
        else {
          stats.pentagon++
        }
      }
      if (isHexagon) {
        if (isRegular) {
          stats.regularHexagon++
        }
        else {
          stats.hexagon++
        }
      }
      if ((typeof stats.others[noOfEdge + '-gon']) === 'undefined') stats.others[noOfEdge + '-gon'] = 0
      stats.others[noOfEdge + '-gon']++
      stats.total++
    }
    return stats
  }

  check('gridlinesEnabled', true)

  let v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12
  v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = v9 = v10 = v11 = v12 = null

  let testCases = []

  testCases.push(function () {
    check('coordsys.cartesian', true)
    check('coordsys.polar', false)
    clear()

    console.log('Cutting a triangle.')
    let dx = 50
    let dy = 600

    let shape = new geom.Polygon([
      v1 = new geom.Point(0, 0),
      v2 = new geom.Point(700, 0),
      v3 = new geom.Point(500, -500)
    ]).shift(dx, dy)
    shapes.push({shape: shape, color: getRandomColor()})
    refreshCanvas()

    cut(new geom.Line(v3, new geom.Point(500, 0)).shift(dx, dy))
    let stats = shapesStats(shapes)
    assert('    Number of polygons = 2', (stats.total === 2))
    assert('    Number of right-angled isosceles triangles = 1', (stats.rightAngledIsoscelesTriangle === 1))
    assert('    Number of right-angled triangles = 1', (stats.rightAngledTriangle === 1))

    refreshCanvas()
  })

  testCases.push(function () {
    check('coordsys.cartesian', true)
    check('coordsys.polar', false)
    clear()

    console.log('Cutting a square.')
    let dx = 200
    let dy = 200

    let shape = new geom.Polygon([
      v1 = new geom.Point(0, 0),
      v2 = new geom.Point(400, 0),
      v3 = new geom.Point(400, 400),
      v4 = new geom.Point(0, 400)
    ]).shift(dx, dy)
    shapes.push({shape: shape, color: getRandomColor()})
    refreshCanvas()

    let stats = null

    console.log('  cut 1:')
    cut(new geom.Line(v4, v2).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 2', (stats.total === 2))
    assert('    Number of right-angled isosceles triangles = 2', (stats.rightAngledIsoscelesTriangle === 2))

    console.log('  cut 2:')
    cut(new geom.Line(v1, v3).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 4', (stats.total === 4))
    assert('    Number of right-angled isosceles triangles = 4', (stats.rightAngledIsoscelesTriangle === 4))

    refreshCanvas()
  })

  testCases.push(function () {
    check('coordsys.cartesian', false)
    check('coordsys.polar', true)
    check('radialLine.mode2', true)
    setTextField('radialLine.mode2.lineCount', '5')

    console.log('Cutting a pentagon.')
    for (let j = 0; j < 2; j++) {
      console.log('  Cutting ' + (j === 0 ? 'anti-clockwisely' : 'clockwisely'))

      clear()

      // Counter-clockwise vertices order.
      let shape = new geom.Polygon([
        new geom.Point(492.7050983124842, 114.683045111454),
        new geom.Point(157.2949016875158, 223.66442431225803),
        new geom.Point(157.2949016875158, 576.335575687742),
        new geom.Point(492.7050983124842, 685.316954888546),
        new geom.Point(700, 400)
      ])
      shapes.push({shape: shape, color: getRandomColor()})
      refreshCanvas()

      let n = shape.countEdges()
      for (let i = 0; i < n; i++) {
        let e1 = (j === 0 ? (i % n) : ((n - 1 - i) % n))
        let e2 = (j === 0 ? ((i + 2) % n) : ((2 * n - 1 - i - 2) % n))
        cut(new geom.Line(shape.edge(e1).x1(), shape.edge(e1).y1(), shape.edge(e2).x1(), shape.edge(e2).y1()))
      }
      let stats = shapesStats(shapes)

      assert('    Number of polygons = 11', (stats.total === 11))
      assert('    Number of isosceles triangles = 10', (stats.isoscelesTriangle === 10))
      assert('    Number of regular pentagons = 1', (stats.regularPentagon === 1))

      refreshCanvas()
    }
  })

  testCases.push(function () {
    check('coordsys.cartesian', false)
    check('coordsys.polar', true)
    check('radialLine.mode2', true)
    setTextField('radialLine.mode2.lineCount', '6')

    console.log('Cutting a hexagon.')
    for (let j = 0; j < 2; j++) {
      console.log('  Cutting ' + (j === 0 ? 'anti-clockwisely' : 'clockwisely'))

      clear()

      // Counter-clockwise vertices order.
      let shape = new geom.Polygon([
        new geom.Point(250.00000000000006, 140.1923788646684),
        new geom.Point(100, 400.00000000000006),
        new geom.Point(250.00000000000006, 659.8076211353316),
        new geom.Point(550, 659.8076211353316),
        new geom.Point(700, 400),
        new geom.Point(550, 140.1923788646684)
      ])
      shapes.push({shape: shape, color: getRandomColor()})
      refreshCanvas()

      let n = shape.countEdges()
      for (let i = 0; i < n; i++) {
        let e1 = (j === 0 ? (i % n) : ((n - 1 - i) % n))
        let e2 = (j === 0 ? ((i + 2) % n) : ((2 * n - 1 - i - 2) % n))
        cut(new geom.Line(shape.edge(e1).x1(), shape.edge(e1).y1(), shape.edge(e2).x1(), shape.edge(e2).y1()))
      }
      let stats = shapesStats(shapes)

      assert('    Number of polygons = 13', (stats.total === 13))
      assert('    Number of isosceles triangles = 6', (stats.isoscelesTriangle === 6))
      assert('    Number of equilateral triangles = 6', (stats.equilateralTriangle === 6))
      assert('    Number of regular hexagons = 1', (stats.regularHexagon === 1))

      refreshCanvas()
    }
  })

  testCases.push(function () {
    check('coordsys.cartesian', true)
    check('coordsys.polar', false)
    clear()

    console.log('Cutting a L-shape.')
    let dx = 200
    let dy = 200

    let shape = new geom.Polygon([
      v1 = new geom.Point(0, 0),
      v2 = new geom.Point(0, 300),
      v3 = new geom.Point(300, 300),
      v4 = new geom.Point(300, 150),
      v5 = new geom.Point(150, 150),
      v6 = new geom.Point(150, 0)
    ]).shift(dx, dy)
    shapes.push({shape: shape, color: getRandomColor()})
    refreshCanvas()

    // geom._flags['geom.Polygon.cut.debug'] = true

    let stats = null

    console.log('  cut 1:')
    cut(new geom.Line(v1, v5).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 2', (stats.total === 2))
    assert('    Number of right-angled isosceles triangles = 1', (stats.rightAngledIsoscelesTriangle === 1))
    assert('    Number of pentagons = 1', (stats.pentagon === 1))

    console.log('  cut 2:')
    cut(new geom.Line(250, 150, 0, 0).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 3', (stats.total === 3))
    assert('    Number of right-angled triangles = 1', (stats.rightAngledTriangle === 1))
    assert('    Number of pentagons = 1', (stats.pentagon === 1))
    assert('    Number of triangles = 1', (stats.triangle === 1))

    console.log('  cut 3:')
    cut(new geom.Line(v5.x(), v5.y(), v5.x(), v2.y()).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 4', (stats.total === 4))
    assert('    Number of right-angled triangles = 1', (stats.rightAngledTriangle === 1))
    assert('    Number of triangles = 1', (stats.triangle === 1))
    assert('    Number of squares = 1', (stats.square === 1))
    assert('    Number of right-angled trapezoids = 1', (stats.rightAngledTrapezoid === 1))

    refreshCanvas()
  })

  testCases.push(function () {
    check('coordsys.cartesian', true)
    check('coordsys.polar', false)
    clear()

    console.log('Cutting a Y-shape.')
    let dx = 400
    let dy = 300

    let shape = new geom.Polygon([
      v1 = new geom.Point(0, 0),
      v2 = new geom.Point(50, -100),
      v3 = new geom.Point(150, -100),
      v4 = new geom.Point(50, 100),
      v5 = new geom.Point(50, 250),
      v6 = new geom.Point(-50, 250),
      v7 = new geom.Point(-50, 100),
      v8 = new geom.Point(-150, -100),
      v9 = new geom.Point(-50, -100)
    ]).shift(dx, dy)
    shapes.push({shape: shape, color: getRandomColor()})
    refreshCanvas()

    // geom._flags['geom.Polygon.cut.debug'] = true

    let stats = null

    console.log('  cut 1:')
    cut(new geom.Line(midPoint(v3, v4), midPoint(v7, v8)).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 3', (stats.total === 3))
    assert('    Number of parallelograms = 2', (stats.parallelogram === 2))
    assert('    Number of hexagons = 1', (stats.hexagon === 1))

    console.log('  cut 2:')
    cut(new geom.Line(v4, v7).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 4', (stats.total === 4))
    assert('    Number of parallelograms = 2', (stats.parallelogram === 2))
    assert('    Number of isosceles trapezoids = 1', (stats.isoscelesTrapezoid === 1))
    assert('    Number of rectangles = 1', (stats.rectangle === 1))

    refreshCanvas()
  })

  testCases.push(function () {
    check('coordsys.cartesian', true)
    check('coordsys.polar', false)
    clear()

    console.log('Cutting a ship-like shape.')
    let dx = 250
    let dy = 300

    let shape = new geom.Polygon([
      v1 = new geom.Point(0, 0),
      v2 = new geom.Point(100, 0),
      v3 = new geom.Point(100, -50),
      v4 = new geom.Point(150, -50),
      v5 = new geom.Point(150, -100),
      v6 = new geom.Point(200, -100),
      v7 = new geom.Point(200, -50),
      v8 = new geom.Point(250, -50),
      v9 = new geom.Point(250, 0),
      v10 = new geom.Point(350, 0),
      v11 = new geom.Point(250, 100),
      v12 = new geom.Point(100, 100)
    ]).shift(dx, dy)
    shapes.push({shape: shape, color: getRandomColor()})
    refreshCanvas()

    // geom._flags['geom.Polygon.cut.debug'] = true

    let stats = null

    console.log('  cut 1:')
    cut(new geom.Line(v4, v7).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 2', (stats.total === 2))
    assert('    Number of squares = 1', (stats.square === 1))
    assert('    Number of 8-gons = 1', (stats.others['8-gon'] === 1))

    console.log('  cut 2:')
    cut(new geom.Line(v2, v12).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 3', (stats.total === 3))
    assert('    Number of squares = 1', (stats.square === 1))
    assert('    Number of hexagons = 1', (stats.hexagon === 1))
    assert('    Number of right-angled isosceles triangles = 1', (stats.rightAngledIsoscelesTriangle === 1))

    console.log('  cut 3:')
    cut(new geom.Line(v9, v11).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 4', (stats.total === 4))
    assert('    Number of squares = 2', (stats.square === 2))
    assert('    Number of right-angled isosceles triangles = 2', (stats.rightAngledIsoscelesTriangle === 2))

    // cut(new geom.Line(v11, v9).shift(dx, dy))

    refreshCanvas()
  })

  testCases.push(function () {
    check('coordsys.cartesian', true)
    check('coordsys.polar', false)
    clear()

    console.log('Cutting a S-like shape.')
    let dx = 400
    let dy = 300

    let shape = new geom.Polygon([
      v1 = new geom.Point(0, 0),
      v2 = new geom.Point(0, 100),
      v3 = new geom.Point(50, 150),
      v4 = new geom.Point(50, 200),
      v5 = new geom.Point(100, 200),
      v6 = new geom.Point(100, 100),
      v7 = new geom.Point(50, 50),
      v8 = new geom.Point(50, 0)
    ]).shift(dx, dy)
    shapes.push({shape: shape, color: getRandomColor()})
    refreshCanvas()

    let stats = null

    console.log('  cut 1:')
    cut(new geom.Line(v2, v7).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 2', (stats.total === 2))
    assert('    Number of right-angled trapezoids = 1', (stats.rightAngledTrapezoid === 1))
    assert('    Number of hexagons = 1', (stats.hexagon === 1))

    console.log('  cut 2:')
    cut(new geom.Line(v3, v6).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 3', (stats.total === 3))
    assert('    Number of right-angled trapezoids = 2', (stats.rightAngledTrapezoid === 2))
    assert('    Number of squares = 1', (stats.square === 1))

    console.log('  cut 3:')
    cut(new geom.Line(midPoint(v1, v2), v7).shift(dx, dy))
    stats = shapesStats(shapes)
    assert('    Number of polygons = 4', (stats.total === 4))
    assert('    Number of right-angled trapezoids = 1', (stats.rightAngledTrapezoid === 1))
    assert('    Number of squares = 2', (stats.square === 2))
    assert('    Number of right-angled isosceles triangles = 1', (stats.rightAngledIsoscelesTriangle === 1))

    refreshCanvas()
  })

  testCases.push(function () {
    check('coordsys.cartesian', true)
    check('coordsys.polar', false)
    clear()

    console.log('Cutting a E-like shape.')
    let dx = 200
    let dy = 100

    let shape = new geom.Polygon([
      v1 = new geom.Point(0, 0),
      v2 = new geom.Point(300, 0),
      v3 = new geom.Point(300, 100),
      v4 = new geom.Point(100, 100),
      v5 = new geom.Point(100, 200),
      v6 = new geom.Point(300, 200),
      v7 = new geom.Point(300, 300),
      v8 = new geom.Point(100, 300),
      v9 = new geom.Point(100, 400),
      v10 = new geom.Point(300, 400),
      v11 = new geom.Point(300, 500),
      v12 = new geom.Point(0, 500)
    ]).shift(dx, dy)
    shapes.push({shape: shape, color: getRandomColor()})
    refreshCanvas()

    // geom._flags['geom.Polygon.cut.debug'] = true

    cut(new geom.Line(100, 0, 100, 500).shift(dx, dy))
    let stats = shapesStats(shapes)
    assert('    Number of polygons = 4', (stats.total === 4))
    assert('    Number of rectangles = 4', (stats.rectangle === 4))

    refreshCanvas()
  })

  let caseNo = 0
  let runTest = function () {
    if (caseNo < testCases.length) {
      let f = testCases[caseNo]
      console.log('=== Running test case ' + (caseNo + 1) + ' ===')
      f()
      console.log('')
      caseNo++
      setTimeout(runTest, 300)
    }
  }
  runTest()

  // testCases[0]()
  // testCases[1]()
  // testCases[2]()
  // testCases[3]()
  // testCases[4]()
  // testCases[5]()
  // testCases[6]()
  // testCases[7]()
  // testCases[8]()
  // testCases[testCases.length - 1]()

  if (Math.random() < 0) {
    console.log(v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12)
  }

  check('mode.add', false)
  check('mode.cut', true)
}

export default geomtest
