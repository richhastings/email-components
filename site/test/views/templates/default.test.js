var compileJade = require('../../../lib/compile-jade')
  , template = compileJade(__dirname + '/../../../views/templates/default.jade')
  , assert = require('chai').assert
  , cheerio = require('cheerio')
  , extend = require('lodash.assign')
  , fixtures = require('../../fixtures/fixture-config.js')
  , baseMockData = { meta: {}, formattedUrls: {}, config: fixtures.baseConfig }

describe('Default Layout: Template', function () {

  describe('Body Class', function () {

    it('should not output a body class if not set', function () {
      var $ = cheerio.load(template(baseMockData))

      assert.equal($('body').attr('class'), undefined)
    })

    it('should output a body class if set', function () {
      var mockData = extend({}, baseMockData, { bodyClass: 'test-class' })
        , $ = cheerio.load(template(mockData))

      assert.equal($('body').hasClass('test-class'), true)
    })

  })

  describe('Browsersync', function () {

    it('should not add Browsersync script if disabled')

    it('should add Browsersync script if enabled', function () {
      var $ = cheerio.load(template(baseMockData))

      assert.equal($('script#__bs_script__').length, 1)
    })

    it('should add correct port to Browsersync script', function () {
      var $ = cheerio.load(template(baseMockData))

      assert.include($('script#__bs_script__').html(), '1234')
    })

  })

})
