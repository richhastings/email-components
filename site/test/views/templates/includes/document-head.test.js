var compileJade = require('../../../../lib/compile-jade')
  , template = compileJade(__dirname + '/../../../../views/templates/includes/document-head.jade')
  , assert = require('chai').assert
  , cheerio = require('cheerio')
  , fs = require('fs')
  , url = require('url')
  , path = require('path')
  , fixtures = require('../../../fixtures/fixture-config.js')

describe('Document Head: Template', function () {

  describe('Required Content', function () {

    it('should error if `url` object not supplied')

    it('should error if `meta` object not supplied')

  })

  describe('Standard Meta Tags', function () {

    it('should not output default content if not set', function () {
      var mockData = { config: fixtures.baseConfig, formattedUrls: {}, meta: {} }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[name="creator"]').length, 0)
      assert.equal($('meta[name="publisher"]').length, 0)
      assert.equal($('meta[name="author"]').length, 0)
    })

    it('should output default content if set', function () {
      var mockData = { config: fixtures.fullConfig, formattedUrls: {}, meta: {} }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[name="creator"]').length, 1)
      assert.equal($('meta[name="publisher"]').length, 1)
      assert.equal($('meta[name="author"]').length, 1)

      assert.equal($('meta[name="creator"]').attr('content'), 'Clock – http://www.clock.co.uk')
      assert.equal($('meta[name="publisher"]').attr('content'), 'Client Name')
      assert.equal($('meta[name="author"]').attr('content'), 'Firstname Lastname')
    })

    it('should output custom override content if set', function () {
      var mockData =
          { config: fixtures.fullConfig
          , formattedUrls: {}
          , meta:
            { creator: 'Custom Creator'
            , publisher: 'Custom Publisher'
            , author: 'Custom Author'
            }
          }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[name="creator"]').length, 1)
      assert.equal($('meta[name="publisher"]').length, 1)
      assert.equal($('meta[name="author"]').length, 1)

      assert.equal($('meta[name="creator"]').attr('content'), 'Custom Creator')
      assert.equal($('meta[name="publisher"]').attr('content'), 'Custom Publisher')
      assert.equal($('meta[name="author"]').attr('content'), 'Custom Author')
    })

  })

  describe('Canonical Link', function () {

    it('should output supplied formatted canonical URL link', function () {
      var mockData =
          { config: fixtures.baseConfig
          , formattedUrls: { canonicalUrl: 'http://example.com' }
          , meta: {}
          }
        , $ = cheerio.load(template(mockData))

      assert.equal($('link[rel="canonical"]').length, 1)
      assert.equal($('link[rel="canonical"]').attr('href'), 'http://example.com')
    })

    it('should error if `url`s doesn’t contain a canonical URL')

  })

  describe('Page Title', function () {

    it('should output project title and strapline if no custom title set', function () {
      var mockData = { config: fixtures.fullConfig, formattedUrls: {}, meta: {} }
        , $ = cheerio.load(template(mockData))

      assert.equal($('title').text(), 'Example Project – Test strapline content')
    })

    it('should output project title and strapline if on homepage', function () {
      var mockData =
          { config: fixtures.fullConfig
          , formattedUrls: { slugUrl: '/' }
          , meta: {}
          }
        , $ = cheerio.load(template(mockData))

      assert.equal($('title').text(), 'Example Project – Test strapline content')
    })

    it('should output custom title and project title if custom title set', function () {
      var mockData =
          { config: fixtures.fullConfig
          , formattedUrls: {}
          , meta: { title: 'Example Page Title' }
          }
        , $ = cheerio.load(template(mockData))

      assert.equal($('title').text(), 'Example Page Title | Example Project')
    })

    it('should output project title if no strapline or custom title set', function () {
      var mockData = { config: fixtures.baseConfig, formattedUrls: {}, meta: {} }
        , $ = cheerio.load(template(mockData))

      assert.equal($('title').text(), 'Example Project')
    })

  })

  describe('Icons, Images and Device Specifics', function () {

    it('should output correct device-specific titles and colors', function () {
      var mockData =
          { config: fixtures.baseConfig
          , formattedUrls: {}
          , meta: {}
          }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[name="theme-color"]').attr('content'), '#0095da')
      assert.equal($('meta[name="apple-mobile-web-app-title"]').attr('content'), 'Short Title')
      assert.equal($('meta[name="application-name"]').attr('content'), 'Full Title')
      assert.equal($('meta[name="msapplication-TileColor"]').attr('content'), '#0095da')

    })

    describe('Ensure all referenced image files exist', function () {
      var mockData =
          { config: fixtures.baseConfig
          , formattedUrls: {}
          , meta: {}
          , share:
            { title: 'Share title'
            , description: 'Share description'
            }
          }
        , $ = cheerio.load(template(mockData))
        , images = []

      $('[href*="/assets/img/meta/"]').each(function () {
        images.push($(this).attr('href'))
      })
      $('[content*="/assets/img/meta/"]').each(function () {
        images.push($(this).attr('content'))
      })

      images.forEach(function (image) {

        // Ensure only relative URLs
        image = url.parse(image).pathname

        // Strip versionator folder from returned file paths
        var parts = image.split('/')
          , filepath
          , filename
          , fullFilepath

        parts.splice(parts.length - 2, 1)
        filepath = parts.join('/')

        filename = path.basename(filepath)
        fullFilepath = __dirname + '/../../../../../site' + filepath

        it(filename, function () {
          assert.equal(fs.existsSync(fullFilepath), true, '“' + filename + '” not found')
        })

      })

    })

  })

  describe('Webmaster Tools', function () {

    it('should output Google Verification code if set', function () {
      var mockData =
          { config: fixtures.fullConfig, formattedUrls: {}, meta: {} }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[name="google-site-verification"]').length, 1)
      assert.equal($('meta[name="google-site-verification"]').attr('content'), 'ABCD1234')
    })

    it('should not output Google Verification code if not set', function () {
      var mockData =
          { config: fixtures.baseConfig, formattedUrls: {}, meta: {} }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[name="google-site-verification"]').length, 0)
    })

    it('should output Bing Verification code if set', function () {
      var mockData =
          { config: fixtures.fullConfig, formattedUrls: {}, meta: {} }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[name="msvalidate.01"]').length, 1)
      assert.equal($('meta[name="msvalidate.01"]').attr('content'), '4321DCBA')
    })

    it('should not output Bing Verification code if not set', function () {
      var mockData =
          { config: fixtures.baseConfig, formattedUrls: {}, meta: {} }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[name="msvalidate.01"]').length, 0)
    })

  })

  describe('Open Graph / Twitter Cards', function () {

    it('should not output any sharing meta information if not set', function () {
      var mockData =
          { config: fixtures.baseConfig, formattedUrls: {}, meta: {} }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[property*="og:"]').length, 0)
      assert.equal($('meta[name*="twitter:"]').length, 0)
    })

    it('should output full Open Graph if custom title and description are set', function () {
      var mockData =
          { config: fixtures.baseConfig
          , formattedUrls: { initialUrl: 'http://example.com' }
          , meta: {}
          , share:
            { title: 'Share title'
            , description: 'Share description'
            }
          }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[property="og:title"]').length, 1)
      assert.equal($('meta[property="og:description"]').length, 1)
      assert.equal($('meta[property="og:type"]').length, 1)
      assert.equal($('meta[property="og:image"]').length, 1)
      assert.equal($('meta[property="og:site_name"]').length, 1)
      assert.equal($('meta[property="og:url"]').length, 1)

      assert.equal($('meta[property="og:title"]').attr('content'), 'Share title')
      assert.equal($('meta[property="og:description"]').attr('content'), 'Share description')
      assert.equal($('meta[property="og:type"]').attr('content'), 'website')
      assert.include($('meta[property="og:image"]').attr('content'), 'http://example.com/assets/img/meta')
      assert.equal($('meta[property="og:site_name"]').attr('content'), 'Example Project')
      assert.equal($('meta[property="og:url"]').attr('content'), 'http://example.com')
    })

    it('should output custom override image and type if set', function () {
      var mockData =
          { config: fixtures.baseConfig
          , formattedUrls: { initialUrl: 'http://example.com' }
          , meta: {}
          , share:
            { title: 'Share title'
            , description: 'Share description'
            , image: 'http://img.clock.co.uk/100'
            , ogType: 'article'
            }
          }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[property="og:type"]').attr('content'), 'article')
      assert.equal($('meta[property="og:image"]').attr('content'), 'http://img.clock.co.uk/100')
    })

    it('should output additional Twitter Card meta information if username is set', function () {
      var mockData =
          { config: fixtures.fullConfig
          , formattedUrls: { initialUrl: 'http://example.com' }
          , meta: {}
          , share:
            { title: 'Share title'
            , description: 'Share description'
            }
          }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[name="twitter:site"]').attr('content'), '@clock')
      assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary')
    })

    it('should output custom override twitter card type if set', function () {
      var mockData =
          { config: fixtures.fullConfig
          , formattedUrls: { initialUrl: 'http://example.com' }
          , meta: {}
          , share:
            { title: 'Share title'
            , description: 'Share description'
            , twitterCardType: 'summary_large_image'
            }
          }
        , $ = cheerio.load(template(mockData))

      assert.equal($('meta[name="twitter:site"]').attr('content'), '@clock')
      assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary_large_image')
    })

  })

})
