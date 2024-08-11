import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newMessage, setNewMessage] = useState({message: null, type: ''})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
    }
  }, [user])

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService.
      create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNewMessage({message: `a new blog ${newTitle} by ${newAuthor} added`, type: 'success'})
            setTimeout(() => {
              setNewMessage({ message: null, type: '' })
            }, 5000)
          setNewAuthor('')
          setNewTitle('')
          setNewUrl('')
        })
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNewMessage({message: `Login successful`, type: 'success'})
        setTimeout(() => {
          setNewMessage({ message: null, type: '' })
        }, 5000)
    } catch (exception) {
      setNewMessage({ message: `wrong username or password`, type: 'error' })
        setTimeout(() => {
          setNewMessage({ message: null, type: '' })
        }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>
        log in to application
      </h2>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
  
  const loggedIn = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in
      <button onClick={handleLogout}>logout</button>
      </p>
    </div>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <h2>
        Create new
      </h2>
      <div>
        title:
        <input
          type="text"
          value={newTitle}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={newAuthor}
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={newUrl}
          onChange={handleUrlChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <Notification message={newMessage.message} type={newMessage.type} />

      {!user && loginForm()}
      {user && loggedIn()}
      {user && blogForm()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App