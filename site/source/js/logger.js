var noopLogger = require('mc-logger')

if (typeof console === 'undefined') {
  // Export a logger that does nothing in browsers without a console
  module.exports = noopLogger
} else {
  // IE9 & 10 have a console but are missing `.debug()`
  if (!console.debug) console.debug = console.log
  module.exports = console
}
