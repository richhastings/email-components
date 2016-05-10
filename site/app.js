var bootstrap = require('./bootstrap')
  , serviceLocator = require('service-locator')()
  , createServerCluster = require('express-server-cluster')
  , env = process.env.NODE_ENV || 'development'
  , inDevelopmentMode = env === 'development'
  // Only have debug logging on development
  , logLevel = process.env.LOG_LEVEL || (inDevelopmentMode ? 'debug' : 'info')
  , bunyan = require('bunyan')
  , mailer = require('../lib/mailer')
  , Metrics = require('cf-metrics')
  , UberCache = require('uber-cache')
  , createConfigury = require('configury')
  , config = createConfigury(__dirname + '/../config.json')(process.env.NODE_ENV)

serviceLocator
  .register('env', env)
  .register('config', config)
  .register('logger', bunyan.createLogger({ name: 'site', stream: process.stdout, level: logLevel }))
  .register('cache', new UberCache())
  .register('mailer', mailer(serviceLocator.config.mailAuth))
  .register('metrics', new Metrics(config.statsd.host
     , config.statsd.port
     , { client: config.client
       , platform: config.platform
       , application: 'site'
       , environment: config.env
       , logger: serviceLocator.logger
       }
     )
   )

bootstrap(serviceLocator, function (error) {
  if (error) throw error

  // Tell there server it's about to start. It needs to add
  // the error handling middleware at the last possible moment.
  serviceLocator.server.emit('preBoot')

  serviceLocator.server.on('started', function (httpServer) {
    serviceLocator.register('httpServer', httpServer)
    serviceLocator.logger.info('Server running: ' + config.url)
  })

  serviceLocator.server.on('requestError', function (error, req) {
    serviceLocator.logger.error('Request Error', error.stack, req.url)
  })

  var options =
    { port: process.env.PORT || serviceLocator.config.port
    , numProcesses: serviceLocator.config.numProcesses
    }

  createServerCluster(serviceLocator.server, serviceLocator.logger, options)

})
