module.exports = createController

function setCacheHeaders (res) {
  // This is an overzealous attempt at not caching anywhere based off of gmail's headers
  res.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate, private, no-transform')
  res.set('Pragma', 'no-cache')
}

function createController (serviceLocator) {

  serviceLocator.router.get('/_health', function (req, res, next) {

    setCacheHeaders(res)

    serviceLocator.healthCheck.run(function (err, results) {
      if (err) return next(err)

      var hasError = results.results.critical &&
        results.results.critical.some(function (result) { return result.error !== undefined })

      res.status(hasError ? 500 : 200).json(results)
    })

  })

}
