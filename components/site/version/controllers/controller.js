module.exports = createController

var fs = require('fs')
  , packageJson = require('../../../../package.json')

function setCacheHeaders (res) {
  // This is an overzealous attempt at not caching anywhere based off of gmail's headers
  res.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate, private, no-transform')
  res.set('Pragma', 'no-cache')
}

function createController (serviceLocator) {

  serviceLocator.router.get('/_version', function (req, res) {

    setCacheHeaders(res)
    fs.readFile(__dirname + '/../../../../version-info.json', function (err, file) {
      if (err) {
        return res.json({ version: packageJson.version, date: ''
          , commit: '', message: 'no `version-info.json` in project root' })
      } else {
        return res.json(JSON.parse(file.toString()))
      }
    })

  })

}
