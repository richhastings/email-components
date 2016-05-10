module.exports = task

function task (pliers) {

  pliers('clean', function (done) {
    // ./build-brower-js.js
    // ./build-modernizr.js
    pliers.rm(__dirname + '/../assets/js/build')

    // ./build-css.js
    pliers.filesets.css.forEach(function (cssFile) {
      pliers.rm(cssFile)
    })

    // ./build-sprite.js
    pliers.rm(__dirname + '/../assets/img/sprite/generated')
    pliers.rm(__dirname + '/../source/stylus/sprite/sprite.styl')

    // ./create-brower-config.js
    pliers.rm(__dirname + '/../source/config.json')

    // ./static-map.js
    pliers.rm(__dirname + '/../static-file-map.json')

    done()
  })

}
