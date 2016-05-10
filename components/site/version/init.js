module.exports = initSite

var createController = require('./controllers/controller')

function initSite () {
  return { version: init }
}

function init (serviceLocator, done) {
  createController(serviceLocator)
  done()
}
