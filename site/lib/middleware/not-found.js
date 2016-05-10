module.exports = createMiddleware

function createMiddleware () {

  return function middleware (req, res, next) {
    try {
      res.statusCode = 404
      res.send('not found')
    } catch (e) {
      next(e)
    }
  }

}
