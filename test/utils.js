'use strict'

var path = require('path')

module.exports.parseFiles = parseFiles

function parseFiles (stdout, dir) {
  var files = []
  var lines = stdout.split(/[\r\n]+/)
  var match

  for (var i = 0; i < lines.length; i++) {
    if ((match = /create.*?: (.*)$/.exec(lines[i]))) {
      var file = match[1]

      if (dir) {
        file = path.resolve(dir, file)
        file = path.relative(dir, file)
      }

      file = file.replace(/\\/g, '/')
      files.push(file)
    }
  }

  return files
}
