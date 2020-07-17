const mongoose = require('mongoose')

module.exports = () => {
  return new User({}).save()
}
