module.exports = server

var express = require('express')
  , versionator = require('versionator')
  , mappedVersion = versionator.createMapped(require(__dirname + '/static-file-map.json'))
  , createErrorHandlerMiddleware = require('./lib/middleware/server-error')
  , createGracefulShutdownMiddleware = require('express-graceful-shutdown')
  , redirectTrailingSlashMiddleware = require('redirect-trailing-slash')
  , uaCompatibleMiddleware = require('ua-compatible')
  , xFrameOptions = require('x-frame-options')
  , morgan = require('morgan')
  , responseTime = require('response-time')
  , compress = require('compression')

function server (serviceLocator) {

  var inDevelopmentMode = serviceLocator.env === 'development'
    // One month static file expire on non-development
    , staticContentExpiry = inDevelopmentMode ? 0 : 2592000000
    , logLevel = inDevelopmentMode ? 'dev' : 'default'
    , logOptions =
        { stream:
          { write: function (data) { serviceLocator.logger.info((data + '').trim()) } }
        }
    , app = express()

  function compressFilter (req, res) {
    return (/svg|json|text|javascript/).test(res.getHeader('Content-Type'))
  }

  // Make compatible with express type http server
  function close (fn) {
    serviceLocator.httpServer.close(fn)
  }

  // Don't tell people we are express
  app.disable('x-powered-by')

  // Trust Varnish and CDN. No more!
  .set('trust proxy', 2)

  // Return 503 while the server is shutting down
  .use(createGracefulShutdownMiddleware({ close: close }, { logger: serviceLocator.logger }))

  // Versionator
  .use(mappedVersion.middleware)
  // Wire up the express logger to the app logger
  .use(morgan(logLevel, logOptions))
  // Add response time as X-Response-Time header
  .use(responseTime())
  // Gzip Compression for static assets
  .use('/assets', compress({ filter: compressFilter }))
  .use('/assets', express.static(__dirname + '/assets', { maxAge: staticContentExpiry }))

  // X-Frame-Options response header to disallow site being iframed
  // See more here: https://developer.mozilla.org/en-US/docs/HTTP/X-Frame-Options.
  .use(xFrameOptions('Sameorigin'))

  // Redirect urls with a trailing slash
  .use(redirectTrailingSlashMiddleware)

  .use(uaCompatibleMiddleware)

  app.on('preBoot', function () {
    // Add server error (500) handler, at the last possible moment
    app.use(createErrorHandlerMiddleware(serviceLocator))
  })

  return app
}
