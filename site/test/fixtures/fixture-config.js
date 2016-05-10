var merge = require('lodash.merge')
  , baseConfig =
    { meta:
      { title: 'Example Project'
      , strapline: null
      , description: null
      , creator: null
      , publisher: null
      , author: null
      , iosTitle: 'Short Title'
      , msTitle: 'Full Title'
      , msTileColor: '#0095da'
      , themeColor: '#0095da'
      , ogTwitterUser: null
      , googleSiteVerification: null
      , bingSiteVerification: null
      }
    , url: 'http://example.com'
    , browserSyncPort: '1234'
    }

  , fullConfigAdditions =
    { meta:
      { strapline: 'Test strapline content'
      , description: 'Test description content'
      , creator: 'Clock – http://www.clock.co.uk'
      , publisher: 'Client Name'
      , author: 'Firstname Lastname'
      , ogTwitterUser: '@clock'
      , googleSiteVerification: 'ABCD1234'
      , bingSiteVerification: '4321DCBA'
      }
    }

module.exports.baseConfig = baseConfig

module.exports.fullConfig = merge({}, baseConfig, fullConfigAdditions)
