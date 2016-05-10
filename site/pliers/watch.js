module.exports = createTask

var notify = require('../../pliers/lib/notify')
  , browserSync = require('browser-sync')

function createTask (pliers, config) {

  pliers('watch', function (done) {

    browserSync.create('site').init({ logSnippet: false, port: config.browserSyncPort })

    pliers.logger.info('Watching for server JS changes')
    pliers.watch(pliers.filesets.serverJs, function () {
      notify('Restarting Server...', config.title + ' Site')
      pliers.run('start', function () {
        notify('Server Restarted', config.title + ' Site')
        browserSync.get('site').reload()
      })
    })

    pliers.logger.info('Watching for server template changes')
    pliers.watch(pliers.filesets.serverTemplates, function () {
      browserSync.get('site').reload()
    })

    pliers.logger.info('Watching for stylus changes')
    pliers.watch(pliers.filesets.stylus, function () {
      pliers.run('buildCss', function () {
        notify('CSS built', config.title + ' Site', config.url)
        browserSync.get('site').reload(pliers.filesets.css)
      })
    })

    pliers.logger.info('Watching for Modernizr changes')
    pliers.watch(pliers.filesets.modernizrConfig, function () {
      pliers.run('buildModernizr', function () {
        notify('Modernizr built', config.title + ' Site', config.url)
        browserSync.get('site').reload()
      })
    })

    pliers.logger.info('Watching for Sprite changes')
    pliers.watch(pliers.filesets.spriteRaw.concat(pliers.filesets.spriteTemplate), function () {
      pliers.run('buildSprite', function () {
        notify('Sprite built', config.title + ' Site', config.url)
        browserSync.get('site').reload(pliers.filesets.spriteCompiled)
      })
    })

    pliers.logger.info('Watching browser JS with watchify')
    pliers.run('watchBrowserJs')

    done()

  })

}
