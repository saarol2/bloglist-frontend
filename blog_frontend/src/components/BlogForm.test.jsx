import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls the createBlog handler with the right details when a new blog is created', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)


  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')

  await user.type(titleInput, 'New Blog Title')
  await user.type(authorInput, 'New Blog Author')
  await user.type(urlInput, 'New Blog URL')

  await user.click(screen.getByText('create'))

  console.log(createBlog.mock.calls)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog).toHaveBeenCalledWith(
    {
      title: 'New Blog Title',
      author: 'New Blog Author',
      url: 'New Blog URL'
    }
  )
})