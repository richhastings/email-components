module.exports = createTask

function createTask (pliers) {
  // Any building that is needed before running the application
  pliers('build'
    , 'buildSprite'
    , 'createStaticMap'
    , 'buildModernizr'
    , 'buildCss'
    , 'createBrowserConfig'
    , 'buildBrowserJs'
    , [ 'createStaticMap' ]
    )
}
