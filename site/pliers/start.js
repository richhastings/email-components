module.exports = createTask

var appProcess
  , bunyanProcess
  , spawn = require('child_process').spawn
  , notify = require('../../pliers/lib/notify')

function createTask (pliers, config) {

  // Start the app and hold onto the process reference for restarting
  pliers('start', function (done) {

    if (appProcess) appProcess.kill()
    if (bunyanProcess) bunyanProcess.kill()

    bunyanProcess = spawn('bunyan', [ '--color' ])
    appProcess = spawn('node', [ __dirname + '/../app' ])

    // Pipe the server output to bunyan
    appProcess.stdout.pipe(bunyanProcess.stdin)
    appProcess.stderr.pipe(bunyanProcess.stdin)

    // Pipe the bunyan output to stdout
    bunyanProcess.stdout.pipe(process.stdout)

    bunyanProcess.stdout.on('data', awaitServerStarted)
    bunyanProcess.on('error', done)

    function awaitServerStarted (data) {
      if (!/Server running:/.test(data)) return
      bunyanProcess.stdout.removeListener('data', awaitServerStarted)
      notify('Server Started', config.title + ' Site', config.url)
      done()
    }

  })

}

// If the process encounters an uncaught exception, the child processes will be
// orphaned and keep hold of any resources they are using (e.g. ports). This ensures
// they are killed when this process unexpectedly dies.
process.on('uncaughtException', function (err) {
  if (appProcess) {
    console.error('uncaughtException killing child process (app)', appProcess.pid)
    appProcess.kill()
  }
  if (bunyanProcess) {
    console.error('uncaughtException killing child process (bunyan)', bunyanProcess.pid)
    bunyanProcess.kill()
  }
  throw err
})
