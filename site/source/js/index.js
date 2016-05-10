//
// Main browser app entry point
//

// Shim ES5 functionality in old browsers
//
//   es5-shim: polyfillable features
//   es5-sham: not-quite polyfillable features but good
//             enough for most use cases, e.g. Object.create()
require('es5-shim/es5-shim')
require('es5-shim/es5-sham')

// Export jQuery everywhere for modules that rely on its globalism
window.$ = window.jQuery = global.jQuery = global.$ = require('../../../site/source/js/lib/vendor/jquery-1.11.3.min.js')

// Runtime for pre-compiled Jade templates
window.jade = require('jade/runtime')

var serviceLocator = require('service-locator')()
  , Emitter = require('events').EventEmitter

  // Responsive designs need breakpoint events to
  // fire in JS when the browser window is resized
  , createBreakpointManager = require('break')
  , bm = createBreakpointManager()
  , breakpoints = require('./breakpoints')

// Create breakpoints on the next tick so that modules
// can know which breakpoint the page was loaded in
process.nextTick(function () {
  bm.add('desktop', breakpoints.desktopMq)
})

serviceLocator.register('breakpointManager', bm)
serviceLocator.register('config', require('../config.json'))
serviceLocator.register('hub', new Emitter())
serviceLocator.register('logger', require('./logger'))

// Bootstrap all the of the components
require('./bootstrap')(serviceLocator)
