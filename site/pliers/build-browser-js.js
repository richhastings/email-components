module.exports = createTasks

var bundle = require('../../pliers/lib/create-browserify-bundler')
  , writeBrowserJs = require('../../pliers/lib/write-browser-js')
  , notify = require('../../pliers/lib/notify')
  , watchify = require('watchify')
  , async = require('async')
  , basename = require('path').basename
  , relative = require('path').relative
  , projectRoot = __dirname + '/../../'
  , destDir = __dirname + '/../assets/js/build/'
  , anyNewerFiles = require('any-newer-files')
  , browserSync = require('browser-sync')
  , devNull = require('dev-null')

function createTasks (pliers, config) {

  pliers('buildBrowserJs', function (done) {

    if (!anyNewerFiles(pliers.filesets.browserJs.concat(pliers.filesets.browserTemplates)
      , pliers.filesets.browserJsCompiled)) {
      pliers.logger.warn('No Browser JS changes found. No JS recompile required.')
      return done()
    }

    pliers.mkdirp(destDir)

    async.each(pliers.filesets.browserBundles, function (entry, cb) {

      var b = bundle(entry, pliers.filesets.vendorJs)
        , stream = b.bundle()
        , filename = basename(entry)
        , sourceMapWebPath = '/assets/js/build/' + filename + '.map'

      pliers.logger.debug('Building', filename)
      b.pipeline.on('error', cb)
      writeBrowserJs(pliers, stream, destDir, filename, sourceMapWebPath, cb)

    }, done)

  })

  pliers('watchBrowserJs', function () {

    pliers.filesets.browserBundles.forEach(function (entry) {

      var b = bundle(entry, pliers.filesets.vendorJs)
        , filename = basename(entry)
        , sourceMapWebPath = '/assets/js/build/' + filename + '.map'

      pliers.logger.debug('Watching', filename)

      b
        .plugin(watchify)
        .on('update', function (ids) {
          pliers.logger.debug('JS watcher saw a change', ids.map(function (path) {
            return relative(projectRoot, path)
          }))
          var stream = b.bundle().on('error', function (err) { pliers.logger.error(err.message) })
          writeBrowserJs(pliers, stream, destDir, filename, sourceMapWebPath, function (err) {
            if (err) pliers.logger.error(err)
            notify('JS built', config.title + ' [site] ' + filename)
            try { browserSync.get('site').reload() } catch (e) {}
          })
        })

      // Watchify won't start outputting 'update' events until it has done a full
      // AST walk. There's no way of doing this other than calling bundle(), which
      // obviously outputs the built JS. It won't start emitting events until this
      // the returned readable stream is drained, but since the JS build will be
      // unavailable while it's piping and it already exists, don't waste time
      // just pipe to /dev/null
      b
        .bundle()
        .pipe(devNull())
        .on('error', function (err) { pliers.logger.error(err.message) })

    })

  })

}
