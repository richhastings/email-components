module.exports = createMiddleware

function createMiddleware (serviceLocator) {

  return function (req, res, next) {
    if (req.headers.host !== serviceLocator.config.hostname) {
      res.writeHead(301, { 'Location': serviceLocator.config.url + req.url })
      res.end()
    } else {
      next()
    }
  }
}
