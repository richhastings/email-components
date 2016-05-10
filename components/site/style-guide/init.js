module.exports = initApi

var createController = require('./controllers/controller')

function initApi () {
  return { styleGuide: init }
}

function init (serviceLocator, done) {
  if (serviceLocator.env !== 'development') return done()
  createController(serviceLocator)
  done()
}
