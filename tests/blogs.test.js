const Page = require('./helpers/page')

let page

beforeEach(async () => {
  page = await Page.build()
  await page.goto(`http://localhost:3000`)
})

afterEach(async () => {
  await page.close()
})

describe(`When logged in`, async () => {
  beforeEach(async () => {
    await page.login()
    await page.click(`a[href="/blogs"]`)
    await page.click(`a.btn-floating`)
  })
  
  it(`can see blog form`, async () => {
    const label = await page.getTextOf(`.title label`)
    expect(label).toEqual(`Blog Title`)
  })
  
  describe(`using valid inputs`, async () => {
    beforeEach(async () => {
      await page.type(`.title input`, `Blog Title`)
      await page.type(`.content input`, `Blog Content`)
      await page.click('button.right')
    })
    
    it(`submitting takes user to review screen`, async () => {
      const heading = await page.getTextOf('form h5')
      expect(heading).toMatch(/.+confirm.+/)
    })
  
    it(`confirming sends to blog page after submitting`, async () => {
      await page.click('button.right')
      await page.waitFor('.card')
      expect(await page.content()).toMatch(/.+Blog Title.+Blog Content.+/)
    })
  })
  
  describe(`using invalid inputs`, async () => {
    beforeEach(async () => {
      await page.click('button.right')
    })
    
    it(`shows an error message on the form`, async () => {
      const titleError = await page.getTextOf(`.title .red-text`)
      const contentError = await page.getTextOf(`.content .red-text`)
      expect(titleError.length).not.toEqual(0)
      expect(contentError.length).not.toEqual(0)
    })
  })
})

describe(`Not Logged In`, async () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'T',
        content: 'C'
      }
    }]
    
  actions.forEach(a => {
    it(`shouldn't ${a.method} path: ${a.path}`, async () => {
      const result = await page.exec(a)
      expect(result).toHaveProperty('error')
    })
  })
})
