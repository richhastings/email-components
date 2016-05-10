module.exports = createFileset

function createFileset (pliers) {

  var spriteImgSourceDir = __dirname + '/../../source/img/sprite'
    , spriteImgDestDir = __dirname + '/../../assets/img/sprite'
    , spriteStylusDir = __dirname + '/../../source/stylus/sprite'

  pliers.filesets('spriteTemplate', spriteStylusDir + '/sprite.styl.tpl')

  pliers.filesets('spriteRaw', spriteImgSourceDir + '/raw/**/*.svg')

  pliers.filesets('spriteCompiled'
    , [ spriteImgDestDir + '/generated/**/*.{png,svg}'
      , spriteStylusDir + '/sprite.styl'
      ]
    )

}
