const program = require('commander')
const fs = require('fs')
const path = require('path')
const { version } = require('./package.json')

module.exports = () => {
  program
    .name('hyron')
    .version(`v${version}`, '--v, --version')
    .option('init <option>', 'initialize a new hyron app')
    .parse(process.argv)
  if (program.init) console.log(`created a new hyron app`)
}
