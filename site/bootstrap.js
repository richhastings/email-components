module.exports = bootstrap

var createServer = require('./server')
  , componentLoader = require('component-loader')
  , glob = require('glob')

// Use this for standard environment setup that is need on all entry points.
// This will often be where components are initialised
function bootstrap (serviceLocator, cb) {

  var server = createServer(serviceLocator)
    , componentGlobs
    , componentPaths
    , components

  serviceLocator
    .register('server', server)
    // Allow possible switching of router away from express
    .register('router', server)

    componentGlobs =
        [ __dirname + '/../components/service/**/init.js'
        , __dirname + '/../components/site/**/init.js'
        ]
    componentPaths = [].concat.apply([], componentGlobs.map(function (path) { return glob.sync(path) }))
    components = componentPaths.map(function (p) { return require(p) })

  componentLoader(components, function (loadComponentFn) {
    return loadComponentFn.bind(null, serviceLocator)
  }, cb)

}
