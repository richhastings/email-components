module.exports = task

var fs = require('fs')
  , versionator = require('versionator')

function task (pliers) {
  pliers('createStaticMap', function (done) {
    versionator.createMapFromPath(__dirname + '/../assets', function (error, staticFileMap) {
      if (error) return pliers.logger.error(error.message)
      var prefixMap = {}
        , key
      for (key in staticFileMap) prefixMap[ '/assets' + key ] = '/assets' + staticFileMap[ key ]
      fs.writeFileSync(__dirname + '/../static-file-map.json', JSON.stringify(prefixMap, null, true))
      done()
    })
  })
}
