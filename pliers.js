module.exports = tasks

var glob = require('glob')

function tasks (pliers) {

  // Load pliers plugins
  glob.sync(__dirname + '/pliers/*.js').forEach(function (file) {
    require(file)(pliers)
  })

  // npm scripts will error unless these tasks exist somewhere in pliers
  pliers('go', function (done) { done() })
  pliers('build', function (done) { done() })

}
