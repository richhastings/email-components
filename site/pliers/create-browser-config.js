module.exports = createTask

var fs = require('fs')
  , createConfigury = require('configury')
  , pick = require('lodash.pick')

function createTask (pliers) {

  pliers('createBrowserConfig', function (done) {
    var config = createConfigury(__dirname + '/../../config.json')(process.env.NODE_ENV)
      , configWhitelist = JSON.parse(fs.readFileSync(__dirname + '/../source/config-whitelist.json', 'utf8'))
      , json = JSON.stringify(pick(config, configWhitelist), null, 2)
    fs.writeFileSync(__dirname + '/../source/config.json', json)
    pliers.logger.trace('site config', json)
    done()
  })

}
