export default {
  methods: {
    dayLeft (date) {
      let timeDiff = new Date(date).getTime() - new Date().getTime()
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
      return diffDays
    },
    uuidv4 () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    hex (c) {
      var s = '0123456789abcdef'
      var i = parseInt (c)
      if (i == 0 || isNaN (c))
        return '00'
      i = Math.round (Math.min (Math.max (0, i), 255))
      return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16)
    },
    /* Convert an RGB triplet to a hex string */
    convertToHex (rgb) {
      return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2])
    },
    /* Remove '#' in color hex string */
    trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s },
    /* Convert a hex string to an RGB triplet */
    convertToRGB (hex) {
      var color = [];
      color[0] = parseInt ((this.trim(hex)).substring (0, 2), 16)
      color[1] = parseInt ((this.trim(hex)).substring (2, 4), 16)
      color[2] = parseInt ((this.trim(hex)).substring (4, 6), 16)
      return color;
    },
    generateColor(colorStart,colorEnd,colorCount){
      // The beginning of your gradient
      var start = this.convertToRGB (colorStart)
      // The end of your gradient
      var end   = this.convertToRGB (colorEnd)
      // The number of colors to compute
      var len = colorCount
      //Alpha blending amount
      var alpha = 0.0
      var saida = []
      for (let i = 0; i < len; i++) {
        var c = []
        alpha += (1.0/len)
        c[0] = start[0] * alpha + (1 - alpha) * end[0]
        c[1] = start[1] * alpha + (1 - alpha) * end[1]
        c[2] = start[2] * alpha + (1 - alpha) * end[2]
        saida.push(this.convertToHex (c))
      }
      return saida
    }
  }
}