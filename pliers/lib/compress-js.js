module.exports = compress

var UglifyJS = require('uglify-js')
  , fs = require('fs')

function compress (filename, sourceMapWebPath) {

  /* eslint camelcase: [ 2, {properties: "never"} ] */
  // ^^ sorry jshint, it's Uglify's fault, not mine!

  var code = fs.readFileSync(filename, 'utf8')
    , ast = UglifyJS.parse(code)
    , compressor = UglifyJS.Compressor({ warnings: false })
    , origSourceMap
    , sourceMap
    , outputOptions = {}
    , output
    , i
    , compressedAst

  if (sourceMapWebPath) {
    origSourceMap = JSON.parse(fs.readFileSync(filename + '.map', 'utf8'))
    sourceMap = UglifyJS.SourceMap({ file: sourceMapWebPath, sourceRoot: '/', orig: origSourceMap })
    outputOptions = { source_map: sourceMap }

    for (i = 0; i < origSourceMap.sourcesContent.length; i++) {
      outputOptions.source_map.get().setSourceContent(origSourceMap.sources[i], origSourceMap.sourcesContent[i])
    }

    outputOptions.source_map.get().setSourceContent(filename, code)
  }

  output = UglifyJS.OutputStream(outputOptions)
  ast.figure_out_scope()

  compressedAst = ast.transform(compressor)
  compressedAst.figure_out_scope()
  compressedAst.compute_char_frequency()
  compressedAst.mangle_names()
  compressedAst.print(output)

  fs.writeFileSync(filename, output.toString() +
    (sourceMapWebPath ? '\n//# sourceMappingURL=' + sourceMapWebPath : ''), 'utf8')
  if (sourceMapWebPath) fs.writeFileSync(filename + '.map', sourceMap.toString(), 'utf8')

}
