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
  })
})