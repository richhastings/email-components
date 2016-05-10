module.exports = initSite

var createController = require('./controllers/controller')
  , HealthCheck = require('cf-health-check')

function initSite () {
  return { healthCheck: init }
}

function init (serviceLocator, done) {
  serviceLocator.register('healthCheck', new HealthCheck())
  createController(serviceLocator)
  done()
}
