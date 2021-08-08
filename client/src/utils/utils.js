const getName = () => {
    let userName = prompt('what is your name?')
    while (!userName) {
        userName = prompt('please enter a valid username')
    }
    return userName
  }

module.exports = {getName}