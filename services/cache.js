const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')

const url = require('../config/keys').redisURL
const client = redis.createClient(url)
client.hget = util.promisify(client.hget)
const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (options = {}) {
  this.cache = true
  this.hashKey = options.key && JSON.stringify(options.key)
  return this
}

mongoose.Query.prototype.exec = async function () {
  if (!this.cache || !this.hashKey) {
    return exec.apply(this, arguments)
  }
  console.log(this.hashKey)
  const key = JSON.stringify(Object.assign({}, this.getQuery(),
    {
      collection: this.mongooseCollection.name
    }))
  const cacheVal = await client.hget(this.hashKey, key)
  if (cacheVal) {
    const data = JSON.parse(cacheVal)
    return Array.isArray(data)
      ? data.map(doc => new this.model(doc))
      : new this.model(data)
  }
  const result = await exec.apply(this, arguments)
  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10)
  return result
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey))
  }
}
