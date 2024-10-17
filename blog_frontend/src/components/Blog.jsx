import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, onLike, onDelete, currentUser }) => {

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


  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService
        .remove(blog.id)
        .then(() => {
          onDelete(blog.id)
        })
    }
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
        <div className="blogDetails">
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={() => onLike(blog)}>like</button></p>
          {currentUser.id === blog.user.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}
export default Blog