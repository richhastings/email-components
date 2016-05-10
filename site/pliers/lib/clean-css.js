var CleanCSS = require('clean-css')

module.exports = function () {

  return function (style) {
    var options =
          { advanced: false
          , aggressiveMerging: false
          , rebase: false
          }
    style = this || style
    style.on('end', function (ignoreErr, source) {
      return new CleanCSS(options).minify(source).styles
    })
  }

}
