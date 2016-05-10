var assert = require('chai').assert
  , getShareUrls = require('../../lib/get-share-urls')

describe('get-share-urls', function () {

  it('should return passed URL as part of all share URLs', function () {
    var shareUrls = getShareUrls('http://example.com')
    assert.include(shareUrls.facebook, 'http://example.com')
    assert.include(shareUrls.twitter, 'http://example.com')
    assert.include(shareUrls.googlePlus, 'http://example.com')
    assert.include(shareUrls.linkedIn, 'http://example.com')
  })

  it('should iterate through additional Twitter-specific options', function () {
    var twitterOptions =
        { text: 'Example'
        , via: '@test'
        , hashtags: 'one,two'
        }
      , shareUrls = getShareUrls('http://example.com', twitterOptions)
    assert.include(shareUrls.twitter, '&text=Example&via=@test&hashtags=one,two')
  })

  it('should encode Twitter `text` option to be URL-safe', function () {
    var shareUrls = getShareUrls('http://example.com', { text: 'Ex"a-m”pl–e He!a@d&line' })
    assert.include(shareUrls.twitter, '&text=Ex%22a-m%E2%80%9Dpl%E2%80%93e%20He!a%40d%26line')
  })

})
