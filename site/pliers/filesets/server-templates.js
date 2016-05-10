module.exports = createFileset

function createFileset (pliers) {
  pliers.filesets('serverTemplates'
    , [ __dirname + '/../../views/templates/**/*.jade'
      , __dirname + '/../../../components/site/**/*.jade'
    ]
    , [ __dirname + '/../../source/js/**/*.jade' ])
}
