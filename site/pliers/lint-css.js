module.exports = createTask

function createTask (pliers) {

  pliers('lintCss', function (done) {
    var files = __dirname + '/../assets/css'

    if (typeof process.argv[ 3 ] !== 'undefined') {
      files += '/' + process.argv[ 3 ] + '.css'
    }
    pliers.exec(__dirname + '/../../node_modules/csslint/cli.js ' + files, done)
  })

}
