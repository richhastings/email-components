module.exports = createTask

var anyNewerFiles = require('any-newer-files')
  , destDir = __dirname + '/../assets/js/build/'
  , pliersModernizr = require('pliers-modernizr')

function createTask (pliers) {

  pliers('buildModernizr', function (done) {

    if (!anyNewerFiles(pliers.filesets.modernizrConfig, pliers.filesets.modernizrCompiled)) {
      pliers.logger.warn('No Modernizr changes found. No recompile required.')
      return done()
    }

    pliersModernizr(pliers, destDir)(function (err) {
      if (err) return done(err)
      done()
    })

  })

}
