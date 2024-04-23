import bcrypt from "bcrypt";
import request from "supertest";
import { connect } from "../src/database/connection.js";
import app from "../src/index.js";
import dotenv from "dotenv";
import process from "node:process"

import {
  createBlog,
  getSingleBlog,
  loginUser,
  deleteBlog,
  getAllPublishedBlogs,
  clearDB,
} from "./helpers/testFunctions.js";

dotenv.config();

const TEST_DB = process.env.TEST_MONGODB_URI;


describe("Blog Post Operations", () => {
  let mongodb, accessToken, createdBlogId;

  // Create a user and log in before all tests
  beforeAll(async () => {
    await clearDB(mongodb);
    const mongodb = await connect(TEST_DB);
    const existingUser = await mongodb.connection.db.collection("users").findOne({username: "testuser123"})
    if (!existingUser){
      await mongodb.connection.db.collection("users").insertOne({
        email: "test@gmail.com",
        password: await bcrypt.hash("password", 10),
        username: "testuser123",
        firstName: "Test",
        lastName: "User",
        role: "USER",
     });
  }
    accessToken = await loginUser({
      email: "test@gmail.com",
      password: "password",
    });
  });

  // Clean up: Delete the user after all tests
  afterAll(async () => {
    clearDB(mongodb)
    await mongodb.connection.close();
  });

  it("should create a blog", async () => {
    const blogDetails = {
      title: "New Post",
      body: "This is the content of the new post.",
    };
    const response = await createBlog(accessToken, blogDetails);
    expect(response.status).toBe(201);
    createdBlogId = response.body.data.id; // Save the ID for later tests
  });
  
  it("should fail to perform get draft post if not author ", async () => {
    const getResponse = await request(app).get(
      `/api/blogs/${createdBlogId}`
    );

    expect(getResponse.body.message).toBe("Unauthorized no authorization header")
    expect(getResponse.status).toBe(401); 
  });

  it("should fail to perform delete blog without Bearer token", async () => {
    const response = await deleteBlog(null, createdBlogId);

    
    expect(response.status).toBe(401); 
  });

 

  it("should retrieve all published blogs", async () => {
    const blogDetails = {
      title: "New Post",
      body: "This is the content of the new post.",
    };
    await createBlog(accessToken, blogDetails);
    const response = await getAllPublishedBlogs();
    console.log(response.body.message)
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  it("should get a blog", async () => {
    const response = await getSingleBlog(accessToken, createdBlogId);
    // expect(response.status).toBe(200);
    expect(response.body.message).toBe("Blog");
  });

  it("should retrieve all published blogs", async () => {
  
    const response = await getAllPublishedBlogs();
    console.log(response.body.message)
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  it("should delete a blog", async () => {
    const response = await deleteBlog(accessToken, createdBlogId);
    // expect(response.status).toBe(200);
    expect(response.body.message).toBe("Blog deleted successfully");
  });

 
});
