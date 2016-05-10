module.exports = bundle

var browserify = require('browserify')
  , browjadify = require('browjadify')

function bundle (entry, noParse) {

  var b = browserify(entry
    , { noParse: noParse
      , debug: true
      , insertGlobals: true
      , cache: {}
      , packageCache: {}
      , fullPaths: true
      })

  b.transform(browjadify({ noParse: noParse, quiet: true }))

  return b

}
