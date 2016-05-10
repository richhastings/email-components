module.exports = mailer

var nodemailer = require('nodemailer')

function mailer (options) {
  options = options || {}

  var possibleOptions = [ 'user', 'pass' ]
    , mailSender

  possibleOptions.map(function (opt) {
    if (typeof options[ opt ] === 'undefined') throw new Error('No ' + opt + ' provided')
  })

  options.port = options.port || 587

  mailSender = nodemailer.createTransport(
    { service: 'mailgun'
    , auth: options
    })

  return { options: options, send: mailSender.sendMail.bind(mailSender) }
}
