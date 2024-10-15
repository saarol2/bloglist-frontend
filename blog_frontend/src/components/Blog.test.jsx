import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

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

  beforeEach(() => {
    container = render(<Blog blog={blog} />).container
  })

  test('renders blog title', () => {
    const element = screen.getByText('Testing blog title rendering', { exact: false })
    screen.debug(element)
    expect(element).toBeDefined()
  })

  test('clicking view button makes other info visible', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking like button twice calls event handler twice', async () => {
    const mockHandler = vi.fn()

    container = render(<Blog blog={blog} onLike={mockHandler} />).container

    const user = userEvent.setup()
    const viewButtons = screen.getAllByText('view')
    const viewButton = viewButtons[1]
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    console.log(mockHandler.mock.calls)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})