module.exports = createTask

var anyNewerFiles = require('any-newer-files')
  , pliersSvgSprite = require('pliers-svg-sprite')
  , pliersImagemin = require('pliers-imagemin')
  , glob = require('glob')

function createTask (pliers) {

  var imgSourceDir = __dirname + '/../source/img/sprite'
    , imgDestDir = __dirname + '/../assets/img/sprite'
    , stylusDir = __dirname + '/../source/stylus/sprite'
    , spriteConfig =
    { imgSourceDir: imgSourceDir + '/raw'
      , imgOutputDir: imgDestDir + '/generated'
      , stylusTemplate: stylusDir + '/sprite.styl.tpl'
      , stylusDest: stylusDir + '/sprite.styl'
    }

  pliers.mkdirp(spriteConfig.imgSourceDir)
  pliers.mkdirp(spriteConfig.imgOutputDir)

  pliers('buildSprite', function (done) {

    if (pliers.filesets.spriteRaw.length < 1) {
      pliers.logger.warn('No raw sprite assets. No compile required.')
      return done()
    }

    if (!anyNewerFiles(pliers.filesets.spriteRaw.concat(pliers.filesets.spriteTemplate)
        , pliers.filesets.spriteCompiled)) {
      pliers.logger.warn('No Sprite changes found. No recompile required.')
      return done()
    }

    pliersSvgSprite(pliers, spriteConfig)(function (err) {
      if (err) return done(err)

      // Optimise compiled images
      pliersImagemin(pliers, glob.sync(spriteConfig.imgOutputDir + '/**/*'))(function (err) {
        if (err) return done(err)
        done()
      })
    })

  })

}
