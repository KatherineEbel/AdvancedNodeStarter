const AWS = require('aws-sdk')
const uuid = require('uuid/v1')
const keys = require('../config/keys')
const requireLogin = require('../middlewares/requireLogin')

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey
})

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    console.log(process.env.AWS_SECRET)
    console.log(process.env.AWS_ID)
    const Key = `${req.user.id}/${uuid()}.jpeg`
    s3.getSignedUrl('putObject', {
      Bucket: 'ke-blog-bucket',
      ContentType: 'image/jpeg',
      Key
    }, (err, url) => res.send({ Key, url}))
  })
}
