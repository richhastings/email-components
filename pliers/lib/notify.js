module.exports = notify

var notifier = require('node-notifier')

function notify (message, title, open) {
  notifier.notify({ title: title, message: message, open: open, group: 'pliers' })
}
