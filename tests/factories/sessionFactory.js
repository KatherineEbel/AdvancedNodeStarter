const Keygrip = require('keygrip')
const cookieKey = require('../../config/keys').cookieKey
const keygrip = new Keygrip([cookieKey])

module.exports = (user) => {
  const data = {
    passport: { user: user._id.toString() }
  }
  const session = Buffer.from(JSON.stringify(data)).toString('base64')
  const sig = keygrip.sign(`session=${session}`)
  return { session, sig }
}
