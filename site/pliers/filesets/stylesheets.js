module.exports = createFileset

function createFileset (pliers) {
  pliers.filesets('stylesheets', __dirname + '/../../source/stylus/index*.styl')
}
