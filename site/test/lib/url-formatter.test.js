var assert = require('assert')
  , urlFormatter = require('../../lib/url-formatter')

describe('url-formatter', function () {
  it('should return formatted URLs', function () {
    var req =
          { protocol: 'http'
          , originalUrl: '/section/page?a=1&b=2#id'
          , get: function () {
              return 'example.com'
            }
          }
      , formattedUrls = urlFormatter(req)

    assert.equal(formattedUrls.initialUrl, 'http://example.com/section/page?a=1&b=2#id')
    assert.equal(formattedUrls.canonicalUrl, 'http://example.com/section/page')
    assert.equal(formattedUrls.slugUrl, '/section/page')
    assert.equal(formattedUrls.slugSection, '/section')

  })
})
