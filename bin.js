#!/usr/bin/env node

var minimist = require('minimist')
var argv = minimist(process.argv.slice(2), {
  alias: {
    port: 'p',
    host: 'h'
  },
  default: {
    port: 80
  }
})

var cmd = argv._[0]

if (cmd === 'listen') {
  var server = require('./server')()

  server.on('subscribe', function (channel) {
    console.log('subscribe: %s', channel)
  })

  server.on('broadcast', function (channel, message) {
    console.log('broadcast: %s (%d)', channel, message.length)
  })

  server.listen(argv.port)
  return
}

if (cmd === 'subscribe') {
  if (argv.length < 3) return console.error('Usage: signalhub subscribe [app] [channel]')
  var client = require('./')((argv.host || 'localhost') + ':' + argv.port, argv._[1])
  client.subscribe(argv._[2]).on('data', function (data) {
    console.log(data)
  })
  return
}

if (cmd === 'broadcast') {
  if (argv.length < 4) return console.error('Usage: signalhub broadcast [app] [channel] [json-message]')
  var client = require('./')((argv.host || 'localhost') + ':' + argv.port, argv._[1])
  client.broadcast(argv._[2], JSON.parse(argv._[3]))
  return
}

console.error('Usage: signalhub listen|subscribe|broadcast')