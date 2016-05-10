var request = require('supertest')
  , express = require('express')
  , createServiceLocator = require('service-locator')
  , healthCheck = require('../init')
  , mockdate = require('mockdate')

function makeCheck (output) {
  return function check (cb) {
    cb(null, output)
  }
}

function errorFn (cb) {
  cb(new Error('Oops'))
}

describe('health-check', function () {

  before(function () {
    mockdate.set(Date.now())
  })

  after(function () {
    mockdate.reset()
  })

  it('should 200 with empty array without registered checks', function (done) {

    var server = express()
      , sl = createServiceLocator()
      sl.register('router', server)

    healthCheck().healthCheck(sl, function () {

      request(server)
        .get('/_health')
        .expect('Content-Type', /json/)
        .expect({ results: {}, summary: { total: { fail: 0, pass: 0, count: 0 } } })
        .expect(200, done)

    })

  })

  it('should 200 and include check output', function (done) {

    var server = express()
      , sl = createServiceLocator()
      sl.register('router', server)

    healthCheck().healthCheck(sl, function () {
      sl.healthCheck.register('critical', { name: 'My test', description: 'checks stuff', fn: makeCheck('OK') })
      request(server)
        .get('/_health')
        .expect('Content-Type', /json/)
        .expect({ results:
          { critical: [ { name: 'My test', description: 'checks stuff', status: 'OK', time: 0 } ] }
          , summary: { total: { fail: 0, pass: 1, count: 1 }, critical: { fail: 0, pass: 1, count: 1 } }
          })
        .expect(200, done)
    })

  })

  it('should 500 if any critical checks fails', function (done) {

    var server = express()
      , sl = createServiceLocator()
      sl.register('router', server)

    healthCheck().healthCheck(sl, function () {
      sl.healthCheck.register('critical'
        , { name: 'Error test', description: 'this is going to break', fn: errorFn })

      sl.healthCheck.register('critical'
        , { name: 'My test', description: 'checks stuff', fn: makeCheck('OK') })

      request(server)
        .get('/_health')
        .expect('Content-Type', /json/)
        .expect(
          { results:
            { critical:
              [ { name: 'Error test', description: 'this is going to break', status: 'Error', error: 'Oops', time: 0 }
              , { name: 'My test', description: 'checks stuff', status: 'OK', time: 0 } ]
            }
          , summary: { total: { fail: 1, pass: 1, count: 2 }, critical: { fail: 1, pass: 1, count: 2 } }
          })
        .expect(500, done)
    })

  })

  it('should 200 of critical pass but warnings fail', function (done) {

    var server = express()
      , sl = createServiceLocator()
      sl.register('router', server)

    healthCheck().healthCheck(sl, function () {
      sl.healthCheck.register('warning'
        , { name: 'Error test', description: 'this is going to break', fn: errorFn })

      sl.healthCheck.register('critical'
        , { name: 'My test', description: 'checks stuff', fn: makeCheck('OK') })

      request(server)
        .get('/_health')
        .expect('Content-Type', /json/)
        .expect(
          { results:
            { critical:
              [ { name: 'My test', description: 'checks stuff', status: 'OK', time: 0 } ]
            , warning:
              [ { name: 'Error test', description: 'this is going to break', status: 'Error', error: 'Oops', time: 0 } ]
            }
          , summary:
            { total: { fail: 1, pass: 1, count: 2 }
            , critical: { fail: 0, pass: 1, count: 1 }
            , warning: { fail: 1, pass: 0, count: 1 }
            }
          })
        .expect(200, done)
    })

  })
})
