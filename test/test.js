const assert = require('assert')
const path = require('path')
var spawn = require('child_process').spawn
const rimraf = require('rimraf')
const tmp = require('tmp')
const utils = require('./utils')
const env = require('./env')

var TMPOBJ = tmp.dirSync().name
var PKG = path.resolve(__dirname, '..', 'package.json')
var BIN = path.resolve(path.dirname(PKG), require(PKG).bin.hyron)

function runCLI (dir, args, callback) {
  var argv = [BIN].concat(args)
  var binp = process.argv[0]
  var stderr = ''
  var stdout = ''

  var child = spawn(binp, argv, {
    cwd: dir
  })

  child.stdout.setEncoding('utf8')
  child.stdout.on('data', function ondata (str) {
    stdout += str
  })
  child.stderr.setEncoding('utf8')
  child.stderr.on('data', function ondata (str) {
    stderr += str
  })

  child.on('close', onclose)
  child.on('error', callback)

  function onclose (code) {
    callback(null, code, stdout, stderr)
  }
}
