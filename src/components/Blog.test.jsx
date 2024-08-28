import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title', () => {
  const blog = {
    title: 'Testing blog title rendering',
    author: 'tester',
    url: 'testurl',
    likes: 0,
    user: {
      username: 'mrtester',
      name: 'tester'
    }
  }
  render(<Blog blog={blog} />)

  const element = screen.getByText('Testing blog title rendering', { exact: false })
  screen.debug(element)
  expect(element).toBeDefined()
})