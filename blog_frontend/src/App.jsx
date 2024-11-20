import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newMessage, setNewMessage] = useState({ message: null, type: '' })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const BlogFormRef = useRef()

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

  const addBlog = (blogObject) => {
    BlogFormRef.current.toggleVisibility()
    blogService.
      create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewMessage({ message: `a new blog ${blogObject.title} by ${blogObject.author} added`, type: 'success' })
        setTimeout(() => {
          setNewMessage({ message: null, type: '' })
        }, 5000)
        BlogFormRef.current.toggleVisibility()
      })
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
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
      setNewMessage({ message: 'Login successful', type: 'success' })
      setTimeout(() => {
        setNewMessage({ message: null, type: '' })
      }, 5000)
    } catch (exception) {
      setNewMessage({ message: 'wrong username or password', type: 'error' })
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


  const loggedIn = () => (
    <div className="loggedIn">
      <p>{user.name} logged in
        <button className="logout" onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={BlogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    </div>
  )

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
    } catch (error) {
      setNewMessage({ message: `Error liking the blog ${blog.title}`, type: 'error' })
      setTimeout(() => {
        setNewMessage({ message: null, type: '' })
      }, 5000)
    }
  }

  const sortedBlogs = blogs.slice().sort((a,b) => b.likes - a.likes)

  const handleDelete = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  return (
    <div className="main">
      <h1 className="blogList">BlogList</h1>
      <Notification message={newMessage.message} type={newMessage.type} />

      {!user && (
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password}
        />
      )}
      {user && loggedIn()}

      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} onLike={handleLike} onDelete={handleDelete} currentUser={username} />
      )}
    </div>
  )
}


export default App