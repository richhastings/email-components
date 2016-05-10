module.exports = createController

var compileJade = require('../../../../site/lib/compile-jade')
  // , slugToTitle = require('slug-to-title')
  , urlFormatter = require('../../../../site/lib/url-formatter')

function createController (serviceLocator) {

  serviceLocator.router.get('/style-guide*', function (req, res) {
    var url = req.url.replace(/\/style-guide[\/]*/, '')
      , title
      , templatePath = __dirname + '/../views/pages/' + (url !== '' ? url : 'index') + '.jade'
      , template = compileJade(templatePath)
      , formattedUrls = urlFormatter(req)
      , getShareUrls = require('../../../../site/lib/get-share-urls.js')
      , twitterOptions =
        { text: 'Example'
        , via: '@test'
        , hashtags: 'one,two'
        }

    res.send(template(
      { config: serviceLocator.config
      , formattedUrls: formattedUrls
      , shareUrls: getShareUrls(formattedUrls.initialUrl, twitterOptions)
      , meta: { title: title || 'Style guide' }
      , colors:
        [ { name: 'Blue', class: 'blue' }
        , { name: 'Black', class: 'black' }
        , { name: 'Grey', class: 'grey' }
        , { name: 'White', class: 'white' }
        ]
      , fonts:
        [ { name: 'Clan Pro Black', class: 'clanpro-black', headline: true }
        , { name: 'Clan Pro Thin', class: 'clanpro-thin', headline: true }
        , { name: 'Quadon Extra Bold', class: 'quadon-extra-bold', headline: true }
        , { name: 'Quadon Regular', class: 'quadon', headline: true }
        , { name: 'Open Sans', class: 'open-sans' }
        , { name: 'Open Sans Italic', class: 'open-sans-italic' }
        , { name: 'Open Sans Semi-bold', class: 'open-sans-semi-bold' }
        , { name: 'Open Sans Semi-bold Italic', class: 'opens-sans-semi-bold-italic' }
        ]
      , ratios:
        [ { name: 'Landscape 4:3', ratio: '4:3' }
        , { name: 'Portrait 3:4', ratio: '3:4' }
        , { name: 'Landscape 16:9', ratio: '16:9' }
        ]
      , adverts:
        [ { name: 'Medium Rectangle / MPU', width: 300, height: 250 }
        , { name: 'Mobile Leaderboard', width: 320, height: 50 }
        , { name: 'Leaderboard', width: 728, height: 90 }
        , { name: 'Large Skyscraper / Billboard', width: 970, height: 250 }
        , { name: 'Half Page', width: 300, height: 600 }
        ]
      }
    ))
  })

}
