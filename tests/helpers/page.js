const puppeteer = require('puppeteer')
const sessionFactory = require('../factories/sessionFactory')
const userFactory = require('../factories/userFactory')

class Page {
  constructor(page) {
    this.page = page
  }
  static async build() {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const customPage = new Page(page)
    return new Proxy(customPage, {
      get(target, p, receiver) {
        return target[p] || browser[p] || page[p]
      }
    })
  }
  
  async login() {
    const user = await userFactory()
    const { session, sig } = sessionFactory(user)
    await this.page.setCookie(
      { name: 'session', value: session },
      { name: 'session.sig', value: sig })
    await this.page.reload()
    await this.page.waitFor('a[href="/auth/logout"]')
  }
  
  async getTextOf(selector) {
    return await this.page.$eval(selector, el => el.innerHTML)
  }
  
  get(path) {
    return this.page.evaluate((_path) => {
      return fetch(_path, {
        method: `GET`,
        credentials: `same-origin`
      }).then(res => res.json())
    }, path)
  }
  
  post(path, data) {
    return this.page.evaluate((_path, _data) => {
      return fetch(_path, {
        method: `POST`,
        credentials: `same-origin`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: _data
      }).then(res => res.json())
    }, path, data)
  }
  
  exec({ method, path, data }) {
    return this[method](path, data)
  }
}

module.exports = Page
