module.exports = createFileset

function createFileset (pliers) {
  pliers.filesets('browserTemplates', __dirname + '/../../source/js/**/*.jade')
}
