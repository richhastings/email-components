module.exports = createFileset

function createFileset (pliers) {
  pliers.filesets('serverJs'
    , [ __dirname + '/../../**/*.js'
      , __dirname + '/../../../components/site/**/*.js'
      , __dirname + '/../../../components/site/**/*.json'
      , __dirname + '/../../../components/service/**/*.js'
      ]
    , [ __dirname + '/../../source/**/*.js'
      , __dirname + '/../../assets/**/*.js' ])
}
