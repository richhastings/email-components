module.exports = createTask

var stylperjade = require('stylperjade')

function createTask (pliers) {

  pliers('stylperjade', function (done) {

    stylperjade(pliers.filesets.css
      , pliers.filesets.serverTemplates.concat(pliers.filesets.browserTemplates)
      , { stylperjaderc: __dirname + '/../.stylperjaderc' }
      , function (err, results) {
          if (err) done(err)
          if (results.blacklistedTotal > 0 || results.unusedTotal > 0) {
            throw results.report
          } else {
            done()
          }
        }
      )

  })

}
