module.exports = write

var exorcist = require('exorcist')
  , fs = require('fs')
  , compressJs = require('./compress-js')
  , compress = [ 'development', undefined ].indexOf(process.env.NODE_ENV) === -1

/*
 * This function takes a readstream that is returned from browserify.bundle()
 * and does the following:
 *   - extracts the sourcemap using exorcist and writes that to a spearate file
 *   - writes the built js to to file system
 *   - if the env!=development compress the js with uglify
 */
function write (pliers, stream, destDir, filename, sourceMapWebPath, cb) {

  var buildStream

  if (compress && sourceMapWebPath) {
    pliers.logger.info('Extracting sourcemap for ‘' + filename + '’')
    buildStream = stream.pipe(exorcist(destDir + filename + '.map', sourceMapWebPath))
  } else {
    buildStream = stream
  }

  buildStream
    .pipe(fs.createWriteStream(destDir + filename, 'utf8'))
    .on('finish', complete)
    .on('error', cb)

  function complete () {
    pliers.logger.debug('Build Complete', filename)
    if (!compress) return cb(null)
    try {
      pliers.logger.warn('Compressing JS. This may take a while.', filename)
      compressJs(destDir + filename, sourceMapWebPath)
      cb(null)
    } catch (e) {
      cb(e)
    }
  }
}
