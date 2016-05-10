module.exports = createMiddleware

var pick = require('lodash.pick')

function createMiddleware (serviceLocator) {

  /* eslint no-unused-vars: 0 */
  return function middleware (err, req, res, next) {

    serviceLocator.logger.error('Error occurred while handling request:\n'
      , pick(req, 'method', 'url', 'query', 'headers', 'ip', 'ips'))

    serviceLocator.logger.error(err.message, err.errors)
    serviceLocator.logger.error(err.stack)

    res.statusCode = err.status || 500
    res.send('Server error')

  }
}
