module.exports = createFileset

function createFileset (pliers) {
  pliers.filesets('browserJs', __dirname + '/../../source/js/**/*.js')
}
