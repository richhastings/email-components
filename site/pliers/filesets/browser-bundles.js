module.exports = createFileset

function createFileset (pliers) {
  pliers.filesets('browserBundles', __dirname + '/../../source/js/index.js')
}
