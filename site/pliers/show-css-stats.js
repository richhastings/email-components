module.exports = createTask

var StyleStats = require('stylestats')
  , prettify = require('stylestats/lib/prettify')
  , Table = require('cli-table')

function createTask (pliers) {

  var files = __dirname + '/../assets/css/*.css'

  pliers('showCssStats', function (done) {
    var stats = new StyleStats(files)

    stats.parse(function (error, result) {
      if (error) done(error)

      var table = new Table(
            { style:
              { head: [ 'cyan' ]
              }
            })

      prettify(result).forEach(function (data) {
        table.push(data)
      })

      console.log(table.toString())

      done()

    })
  })

}
