# Bloglist Web Application

This is a Bloglist web application, where users can create, view, like, and delete blogs. The application sorts blogs based on the number of likes, with the most liked blogs appearing at the top. This project is done as part of Full Stack open course at the University of Helsinki.

## Features

- **Blog Creation**: Users can create new blog entries by providing a title, author, and URL.
- **Like Blogs**: Each blog entry can be liked, with likes counting up on each click.
- **View Blogs**: Users can expand individual blogs to view more details.
- **Blog Sorting**: Blogs are automatically sorted based on the number of likes in descending order.
- **Delete Blogs**: Blogs can be deleted by their creator.

## Technologies Used

The project leverages several key technologies, including:

### Frontend

- **React**: The user interface is built with React, creating a responsive and dynamic user experience.
- **CSS**: CSS is used for the notifications
- **Playwright**: Playwright is used for end-to-end testing.

### Backend

- **Node.js and Express**: The backend is developed using Node.js with the Express framework to handle HTTP requests and routing.
- **MongoDB**: MongoDB serves as the database for storing blog data, including titles, authors, URLs, and likes.
- **Mongoose**: Mongoose is used for object data modeling, enabling easy interaction with MongoDB.
- **JSON Web Token (JWT)**: Authentication is managed with JWT, allowing users to log in securely.
- **bcrypt**: For hashing passwords, bcrypt is used, adding security to user accounts.

### Testing

- **Vitest**: Unit and integration tests for backend logic are written with Vitest.
- **Playwright**: End-to-end tests verify that the entire application works as expected.