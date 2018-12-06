const hyron = require('hyron')
var myApp = hyron.getInstance(3000, 'localhost')

myApp.enableService({
  demo: require('./simpleApp')
})

myApp.startServer()
