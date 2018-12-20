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

describe('Hyron', function () {
  after(function (done) {
    this.timeout(10000)
    rimraf(TMPOBJ, done)
  })

  describe('<project-name>', function () {
    var inst = env(this.fullTitle())

    it('should create project directory', function (done) {
      runCLI(inst.dir, ['foo'], function (err, code, stdout, stderr) {
        if (err) return done(err)
        inst.files = utils.parseFiles(stdout, inst.dir)
        inst.stderr = stderr
        inst.stdout = stdout
        assert.strictEqual(inst.files.length, 11)
        done()
      })
    })

    it('should provide change directory instructions', function () {
      assert.ok(/cd foo/.test(inst.stdout))
    })

    it('should provide install instructions', function () {
      assert.ok(/npm install/.test(inst.stdout))
    })

    it('should have basic files', function () {
      assert.notStrictEqual(inst.files.indexOf('foo/package.json'), 6)
      assert.notStrictEqual(inst.files.indexOf('foo/app.js'), 7)
      assert.notStrictEqual(inst.files.indexOf('foo/simpleApp.js'), 8)
    })
  })
})

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
