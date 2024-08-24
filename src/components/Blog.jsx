import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, handleLike }) => {

  const [visibility, setVisibility] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }


  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visibility ? 'hide' : 'view'}
        </button>
      </div>
      {visibility && (
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
          {blog.user.name}
        </div>
      )}
    </div>
  )
}
export default Blog