import bcrypt from "bcrypt";
import request from "supertest";
import { connect } from "../src/database/connection.js";
import app from "../src/index.js";
import dotenv from "dotenv";
import {
  createBlog,
  loginUser,
  deleteBlog,
  getAllBlogs,
  clearDB,
} from "./helpers/testFunctions.js";

dotenv.config();

const TEST_DB = process.env.TEST_MONGODB_URI;

describe("Blog Post Operations", () => {
  let mongodb, accessToken, createdBlogId;

  // Create a user and log in before all tests
  beforeAll(async () => {
    const mongodb = await connect(TEST_DB);
    await clearDB(mongodb);
    await mongodb.connection.db.collection("users").insertOne({
      email: "test@gmail.com",
      password: await bcrypt.hash("password", 10),
      username: "testuser123",
      firstName: "Test",
      lastName: "User",
      role: "USER",
    });
    accessToken = await loginUser({
      email: "test@gmail.com",
      password: "password",
    });
  });

  // Clean up: Delete the user after all tests
  afterAll(async () => {
    await clearDB(mongodb);
    await mongodb.connection.close();
    await mongodb.connection.db.collection("users").insertOne({
      email: "test@gmail.com",
      password: await bcrypt.hash("password", 10),
      username: "testuser123",
      firstName: "Test",
      lastName: "User",
      role: "USER",
    });
    accessToken = await loginUser({
      email: "test@gmail.com",
      password: "password",
    });
  });
  beforeEach(async () => {});

  it("should create a blog", async () => {
    const blogDetails = {
      title: "New Post",
      body: "This is the content of the new post.",
    };
    const response = await createBlog(accessToken, blogDetails);
    expect(response.status).toBe(201);
    createdBlogId = response.body.data.id; // Save the ID for later tests
  });

  it("should delete a blog", async () => {
    const response = await deleteBlog(accessToken, createdBlogId);
    // expect(response.status).toBe(200);
    expect(response.body.message).toBe("Blog deleted successfully");
  });

  it("should retrieve all posts with accessToken", async () => {
    const response = await getAllBlogs(accessToken);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.data.length).toBeGreaterThanOrEqual(0);
  });
  it("should retrieve all posts without accessToken", async () => {
    noAccessToken = null;
    const response = await getAllBlogs(noAccessToken);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.data.length).toBeGreaterThanOrEqual(0);
  });

  it("should fail to perform operations without Bearer token", async () => {
    const postResponse = await request(app)
      .post("/api/blogs")
      .send({ title: "Unauthorized Post", body: "This should fail." });
    const deleteResponse = await request(app).delete(
      `/api/blogs/${createdBlogId}`
    );
    const getResponse = await request(app).get("/api/blogs");

    expect(postResponse.status).toBe(401);
    expect(deleteResponse.status).toBe(401);
    expect(getResponse.status).toBe(401);
  });
});
