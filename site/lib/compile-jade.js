module.exports = compileJade

var jade = require('jade')
  , fs = require('fs')
  , versionator = require('versionator')
  , mappedVersion = versionator.createMapped(require('../static-file-map.json'))
  , assign = require('lodash.assign')
  , createConfigury = require('configury')
  , config = createConfigury(__dirname + '/../../config.json')(process.env.NODE_ENV)
  , formatter = require('cf-formatter')
  , format = formatter(config)
  , inDevelopmentMode = (process.env.NODE_ENV || 'development') === 'development'

function loadTemplate (file) {
  var template = fs.readFileSync(file)
    , options =
        { compileDebug: true
        , filename: file
        , basedir: __dirname + '/../views/templates'
        }
  return jade.compile(template, options)
}

function compileJade (file) {
  var fn
    , globals =
      { versionPath: mappedVersion.versionPath
      , enableBrowserSync: inDevelopmentMode
      , format: format
      }

  if (!fs.existsSync(file)) {
    throw new Error(file + ' does not exist')
  }

  return function (locals) {
    if (inDevelopmentMode || fn === undefined) fn = loadTemplate(file)
    return fn(assign({}, locals, globals))
  }
}
