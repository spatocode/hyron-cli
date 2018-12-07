const program = require('commander')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const { version } = require('./package.json')

let projectName

module.exports = () => {
  program
    .name('hyron')
    .version(`v${version}`, '--v, --version')
    .arguments('<project-name>')
    .usage(`${chalk.green('<project-name>')} [options]`)
    .action(name => {
      projectName = name
    })
    .option('-s, --style <engine>', 'set stylesheet <engine> support (less|stylus|sass) (defaults to plain css)')
    .on('--help', () => {
      console.log()
      console.log(
        `    If you have any problems, do not hesitate to file an issue:`
      )
      console.log(
        `      ${chalk.cyan(
          'https://github.com/spatocode/hyron-cli/issues/new'
        )}`
      )
    })
    .parse(process.argv)

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
    let root = path.resolve(program.args.shift())
    const appName = createAppName(root) || 'hello-world'
    fs.ensureDirSync(appName)

    console.log(`Creating a new Hyron app in ${chalk.green(root)}`)
    console.log()

    // JavaScript
    const app = loadFile('js/app.js')
    const simpleApp = loadFile('js/simpleApp.js')

    // Styles
    var styles

    // Style extention
    var ext

    // Package
    const packageJson = {
      name: appName,
      version: '0.0.0',
      private: true,
      scripts: {
        start: 'node ./bin/www'
      },
      dependencies: {
        'hyron': '~1.9.10'
      }
    }

    mkdir(root, 'routes')
    mkdir(root, 'views')
    mkdir(root, 'public')
    mkdir(root, 'public/javascripts')
    mkdir(root, 'public/images')
    mkdir(root, 'public/stylesheets')

    switch (program.style) {
      case 'stylus':
        styles = loadFile('stylesheets/style.styl')
        ext = '.styl'
        break
      case 'sass':
        styles = loadFile('stylesheets/style.sass')
        ext = '.sass'
        break
      case 'less':
        styles = loadFile('stylesheets/style.less')
        ext = '.less'
        break
      case 'compass':
        styles = loadFile('stylesheets/style.scss')
        ext = '.scss'
        break
      default:
        styles = loadFile('stylesheets/style.css')
        ext = '.css'
    }

    generateFiles(root, packageJson, app, simpleApp, ext, styles)
  }

  function loadFile (fileName) {
    var contents = fs.readFileSync(path.join(__dirname, 'files', fileName), 'utf-8')
    return contents
  }

  /**
   * Create new directories
   * @param {String} rootDir
   * @param {Array} newDir
   */

  function mkdir (rootDir, newDir) {
    var dir = path.join(rootDir, newDir)
    console.log(`   ${chalk.cyan('create')} :  ${chalk.green(dir)}${chalk.green(path.sep)}`)

    fs.mkdirSync(dir)
  }

  function generateFiles (rootDir, packageJson, app, simpleApp, ext, styles) {
    fs.writeFileSync(
      path.join(rootDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    )

    fs.writeFileSync(path.join(rootDir, 'app.js'), app)
    fs.writeFileSync(path.join(rootDir, 'simpleApp.js'), simpleApp)
    fs.writeFileSync(path.join(rootDir, 'public', 'stylesheets', 'style' + ext), styles)
  }

  if (projectName) createApplication()
  if (typeof projectName === 'undefined') {
    console.error('Please specify the project name:')
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('<project-name>')}`
    )
    console.log()
    console.log('For example:')
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-hyron-app')}`)
    console.log()
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    )
    process.exit(1)
  }
}
