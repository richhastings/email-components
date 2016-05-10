module.exports = getShareUrls

function getShareUrls (initialUrl, twitterOptions) {

  var shareUrls =
      { facebook: 'https://www.facebook.com/sharer/sharer.php?&u=' + initialUrl
      , twitter: 'https://twitter.com/share?url=' + initialUrl
      , googlePlus: 'https://plus.google.com/share?url=' + initialUrl
      , linkedIn: 'https://www.linkedin.com/shareArticle?mini=true&url=' + initialUrl
      }
     , option
     , value

  if (twitterOptions) {
    for (option in twitterOptions) {
      value = twitterOptions[option]
      value = (option === 'text') ? encodeURIComponent(twitterOptions[option]) : value
      shareUrls.twitter += '&' + option + '=' + value
    }
  }

  return shareUrls

}
