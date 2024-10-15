const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
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
})