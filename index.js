const program = require('commander')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const { version } = require('./package.json')

module.exports = () => {
  program
    .name('hyron')
    .version(`v${version}`, '--v, --version')
    .option('init <option>', 'initialize a new hyron app')
    .parse(process.argv)
  if (program.init) console.log(`created a new hyron app`)

  /**
   * Create an app name, enforcing npm naming requirements
   *
   * @param {String} name
   */

  function createAppName (name) {
    return path.basename(name)
      .replace(/[^A-Za-z0-9,-]+/g, '-')
      .replace(/^[-_.]+|-+$/g, '')
      .toLowerCase()
  }

  function createApplication () {
    
  }
}
