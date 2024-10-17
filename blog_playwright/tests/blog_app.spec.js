const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.getByText('log in to application')
    await expect(loginForm).toBeVisible()
    const usernameInput = page.getByTestId('username')
    const passwordInput = page.getByTestId('password')
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    const loginButton =  page.getByRole('button', { name: 'login' })
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

    const errorDiv = await page.locator('.notification-error')
    await expect(errorDiv).toContainText('wrong username or password')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(await page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await expect(await page.getByText('test title test author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'try to like this', 'another test author', 'test url')
      const otherBlogText = await page.getByText('try to like this another test author')
      const otherBlogElement = await otherBlogText.locator('..')

      await otherBlogElement.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(await page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'try to delete this', 'another test author', 'test url')
      const otherBlogText = await page.getByText('try to delete this another test author')
      const otherBlogElement = await otherBlogText.locator('..')

      await otherBlogElement.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept());
      await otherBlogElement.getByRole('button', { name: 'delete' }).click()
      await expect(otherBlogText).not.toBeVisible()
    })

    test('only the user who created it, sees the delete button', async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          name: 'testaaja',
          username: 'testaaja',
          password: 'testaaja'
        }
      })
      await createBlog(page, 'try to delete this', 'another test author', 'test url')
      const otherBlogText = await page.getByText('try to delete this another test author')
      const otherBlogElement = await otherBlogText.locator('..')

      await otherBlogElement.getByRole('button', { name: 'view' }).click()
      await expect(await page.getByRole('button', { name: 'delete' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'testaaja', 'testaaja')
      await otherBlogElement.getByRole('button', { name: 'view' }).click()
      await expect(await page.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await createBlog(page, 'first', 'first', 'first')
      const first = await page.getByText('first first')
      const firstElement = await first.locator('..')

      await firstElement.getByRole('button', { name: 'view' }).click()
      await firstElement.getByRole('button', { name: 'like' }).click()
      await firstElement.getByRole('button', { name: 'like' }).click()
      await firstElement.getByRole('button', { name: 'like' }).click()


      await createBlog(page, 'second', 'second', 'second')
      const second = await page.getByText('second second')
      const secondElement = await second.locator('..')

      await secondElement.getByRole('button', { name: 'view' }).click()
      await secondElement.getByRole('button', { name: 'like' }).click()
      await secondElement.getByRole('button', { name: 'like' }).click()

      await createBlog(page, 'third', 'third', 'third')
      const third = await page.getByText('third third')
      const thirdElement = await third.locator('..')

      await thirdElement.getByRole('button', { name: 'view' }).click()
      await thirdElement.getByRole('button', { name: 'like' }).click()

      const blogs = await page.locator('.blog')
      const blogTitles = await blogs.evaluateAll((elements) => elements.map(e => e.innerText))
      expect(blogTitles[0]).toContain('first')
      expect(blogTitles[1]).toContain('second')
      expect(blogTitles[2]).toContain('third')
    })
  })
})