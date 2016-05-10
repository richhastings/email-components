module.exports = createFileset

function createFileset (pliers) {
  pliers.filesets('browserJsCompiled', __dirname + '/../../assets/js/build/index.js')
}
