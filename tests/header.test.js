const Page = require('./helpers/page')

let page

beforeEach(async () => {
  page = await Page.build()
  await page.goto('http://localhost:3000')
})

afterEach(async () => {
  await page.close()
})


it('should have the correct text', async () => {
  expect(await page
    .getTextOf('a.brand-logo'))
    .toEqual('Blogster')
})

it(`should start oauth flow when login link clicked`, async () => {
  await page.click('.right a')
  const url = await page.url()
  expect(url).toMatch(/accounts\.google\.com/)
})

it(`should show logout button when signed in`, async () => {
  await page.login()
  expect(await page
    .getTextOf('a[href="/auth/logout"]'))
    .toBe('Logout')
})

