module.exports = createFileset

function createFileset (pliers) {
  pliers.filesets('stylus', __dirname + '/../../source/stylus/**/*.styl')
}
