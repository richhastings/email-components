module.exports = createTask

var stylus = require('stylus')
  , renderStylus = require('stylus-renderer')
  , versionator = require('versionator')
  , cleancss = require('./lib/clean-css')

  , anyNewerFiles = require('any-newer-files')
  , env = process.env.NODE_ENV || 'development'

  , autoprefixer = require('autoprefixer-stylus')
  , stylusMixins = require('stylus-mixins')
  , responsiveGrid = require('responsive-grid')

function createTask (pliers) {

  pliers('buildCss', function (done) {

    if (!anyNewerFiles(pliers.filesets.stylus, pliers.filesets.css)) {
      pliers.logger.warn('No Stylus changes found. No CSS recompile required.')
      return done()
    }

    var mappedVersion = versionator.createMapped(require(__dirname + '/../static-file-map.json'))
      , stylesheets = pliers.filesets.stylesheets
      , srcDir = __dirname + '/../source/stylus'
      , destDir = __dirname + '/../assets/css'

    pliers.mkdirp(destDir)

    renderStylus(stylesheets
      , { src: srcDir
        , dest: destDir
        , use: [ autoprefixer(), stylusMixins(), responsiveGrid(), cleancss(pliers) ]
        , stylusOptions: { compress: false }
        , define:
          { $ENV: env
          , versionPath: function (urlPath) {
              return new stylus.nodes.Literal('url(' + mappedVersion.versionPath(urlPath.val) + ')')
            }
          }
        }
        , function (err) {
          if (err) {
            pliers.logger.error('Failed to build CSS')
            pliers.logger.error(err.message)
          }
          done()
        }).on('log', function (msg, level) { pliers.logger[ level ](msg) })

  })
}
