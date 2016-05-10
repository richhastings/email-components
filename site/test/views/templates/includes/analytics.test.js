var compileJade = require('../../../../lib/compile-jade')
  , template = compileJade(__dirname + '/../../../../views/templates/includes/analytics.jade')
  , assert = require('chai').assert
  , cheerio = require('cheerio')

describe('Analytics: Template', function () {

  describe('Google Analytics', function () {

    it('should output nothing if config is not set', function () {
      var $ = cheerio.load(template())

      assert.equal($('script').length, 0)
    })

    it('should output GA code with correct domain and tracking ID', function () {
      var mockData =
          { config:
            { gaTrackingId: 'UA-ABCD1234-1'
            , domain: 'example.com'
            }
          }
        , $ = cheerio.load(template(mockData))

      assert.equal($('script').length, 1)
      assert.include($('script').html(), 'example.com')
      assert.include($('script').html(), 'UA-ABCD1234-1')
    })

  })

})
