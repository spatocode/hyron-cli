const path = require('path')
const fs = require('fs-extra')
const rimraf = require('rimraf')
const tmp = require('tmp')

var tmpobj = tmp.dirSync().name

module.exports = env

function env (name) {
  var inst = {}

  before('create environment', function (done) {
    inst.dir = path.join(tmpobj, name.replace(/[<>]/g, ''))
    fs.mkdir(inst.dir)
    done()
  })

  after('cleanup', function (done) {
    this.timeout(30000)
    rimraf(inst.dir, done)
  })

  return inst
}
