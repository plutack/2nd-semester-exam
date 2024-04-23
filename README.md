# hosted link to site ->

## an hosted instance of of mongodb on mongodb cloud is used as the database


# Alt school blog semester Exam API Documentation

This document outlines the API endpoints available for the Twond Semester Exam application hosted at `https://twond-semester-exam.onrender.com/`. It provides details on how to perform authentication, manage blog posts, and interact with the system as different user roles.

## Base URL

All API requests should be made to: https://twond-semester-exam.onrender.com/


## Authentication

### Login

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Logs in a user and returns an access token.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  
    Success Response:
    
    {
   "message": "Login successful",
    "data": {
      "accessToken": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "username": "string",
      "role": "string",
      timestamps
    }
  } 

  ```

- **Endpoint:** `/register`
- **Method:** `POST`
- **Description:** Register new user.
- **Request Body:**
    ```
    {
     "firstName": "string",
      "lastName": "string",
      "email": "string", // must be unique
      "password": "string", // min 7 characters
      "confirmPassword": "string",
      "username": "string" //must be unique
    }

    Success Response:
    {
      "message": "User created successfully",
      "data": {
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        {timestamps}
     }
    }
   }
 
   ```
    
- **Endpoint:** `/api/blogs`
- **Method:** `GET`
- **Description:** Retrieves all blogs that are marked as                 'published'. This endpoint is accessible by both logged in and logged out users.
- **Request Body:** 
  ```
  Success Response:
  {
    "message": "All Blogs 
    "data": [
      {
        "title": "string",
        "body": "string",
        "author": {user object},
        "state": "published",
        "description": "string",
        "tags": ["string"],
        {timestamps},
       }
      ]
    }
   ```
 
 
- **Endpoint:** `/api/blogs/${id}`
- **Method:** `GET`
- **Description:** Retrieves a single blog with {id} that are marked as 'published'. This endpoint is accessible by both logged in and logged out users.
- **Request Body:** 
  ```
  Success Response:
  {
    "message": "All Blogs 
    "data":
      {
        "title": "string",
        "body": "string",
        "author": {user object},
        "state": "published",
        "description": "string",
        "tags": ["string"],
        {timestamps},
   }
  }
 ```

