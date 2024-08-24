import { useState } from 'react'

const Blog = ({ blog }) => {

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
          <p>likes {blog.likes} <button>like</button></p>
          {blog.user.name}
        </div>
      )}
    </div>
  )
}
export default Blog