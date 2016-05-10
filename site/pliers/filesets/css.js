module.exports = createFileset

function createFileset (pliers) {
  pliers.filesets('css', __dirname + '/../../assets/css/**/*.css')
}
