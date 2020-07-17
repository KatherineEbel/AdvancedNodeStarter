const puppeteer = require('puppeteer')
const sessionFactory = require('./factories/sessionFactory')
const userFactory = require('./factories/userFactory')

let browser, page

beforeEach(async () => {
  browser = await puppeteer.launch({ headless: false })
  page = await browser.newPage()
  await page.goto('localhost:3000')
})

afterEach(async () => {
  await browser.close()
})


it('should have the correct text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML)
  expect(text).toEqual('Blogster')
})

it(`should start oauth flow when login link clicked`, async () => {
  await page.click('.right a')
  const url = await page.url()
  expect(url).toMatch(/accounts\.google\.com/)
})

it(`should show logout button when signed in`, async () => {
  // const user = `5f0d1a2af60cf8c0ae3fcfd5`
  const user = await userFactory()
  const { session, sig } = sessionFactory(user)
  await page.setCookie(
    { name: 'session', value: session },
    { name: 'session.sig', value: sig })
  await page.reload()
  await page.waitFor('a[href="/auth/logout"]')
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)
  expect(text).toBe('Logout')
})
