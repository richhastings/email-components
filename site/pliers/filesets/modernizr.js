module.exports = createFileset

function createFileset (pliers) {
  pliers.filesets('modernizrConfig', __dirname + '/../../modernizr.json')
  pliers.filesets('modernizrCompiled', __dirname + '/../../assets/js/build/modernizr.js')
}
