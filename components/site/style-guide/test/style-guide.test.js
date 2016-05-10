var request = require('supertest')
  , async = require('async')
  , express = require('express')
  , createController = require('../controllers/controller')
  , serviceLocator = require('service-locator')()
  , createConfigury = require('configury')
  , config = createConfigury(__dirname + '/../../../../config.json')(process.env.NODE_ENV)
  , app = express()

serviceLocator.register('config', config)
serviceLocator.register('router', app)

createController(serviceLocator)

describe('Style guide', function () {

  it('should return 200 for each style guide route', function (done) {
    var routes =
      [ '/style-guide'
      , '/style-guide/branding'
      , '/style-guide/typography'
      , '/style-guide/font-samples'
      , '/style-guide/buttons'
      , '/style-guide/controls'
      , '/style-guide/forms'
      , '/style-guide/components'
      , '/style-guide/image-ratios'
      , '/style-guide/advertising'
      , '/style-guide/template-variables'
      ]

    function testRoute (route, cb) {
      request(app)
        .get(route)
        .expect(200, cb)
    }

    async.each(routes, testRoute, done)
  })
})
