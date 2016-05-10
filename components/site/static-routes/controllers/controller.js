var compileJade = require('../../../../site/lib/compile-jade')
  , fs = require('fs')

module.exports = function createController (serviceLocator) {

  serviceLocator.router.get('*', function (req, res, next) {
    var url = req.url.replace('/', '')
      , filename = url !== '' ? url : 'index'
      , templatePath = __dirname + '/../views/' + filename + '.jade'
      , dataPath = __dirname + '/../data/' + filename + '.json'
      , template
      , data = {}

    if (fs.existsSync(templatePath)) {
      template = compileJade(templatePath)
    } else {
      return next()
    }

    if (fs.existsSync(dataPath)) {
      data = require(dataPath)
    }

    data.config = serviceLocator.config
    data.meta = data.meta || {}

    res.send(template(data))
  })

}
