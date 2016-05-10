module.exports = bootstrap

var components =
  []

function bootstrap (serviceLocator) {
  components.forEach(function (component) {
    component(serviceLocator)
  })
}
