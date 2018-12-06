module.exports = class {
  static requestConfig () {
    return {
      sayHello: 'get'
    }
  }

  sayHello (yourName = 'you') {
    return 'Hello ' + yourName + ', Welcome to HyronJS'
  }
}
