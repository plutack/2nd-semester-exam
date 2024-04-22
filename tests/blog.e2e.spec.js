import bcrypt from "bcrypt";
import request from "supertest";
import { connect } from "../src/database/connection.js";
import app from "../src/index.js";
import dotenv from "dotenv";
import { createPost, loginUser, deletePost, getAllPosts, clearDB } from "./helpers/testFunctions.js";

dotenv.config();

const TEST_DB = process.env.TEST_MONGODB_URI;

describe("Blog Post Operations", () => {
  let mongodb, accessToken, createdPostId;
  
  // Create a user and log in before all tests
  beforeAll(async () => {
    mongodb = connect(TEST_DB);
      await mongodb.connection.db.collection("users").insertOne({
          email: "test@gmail.com",
          password: await bcrypt.hash("password", 10),
          username: "testuser123",
          firstName: "Test",
          lastName: "User",
          role: "USER",
      });
      accessToken = await loginUser({ email: "test@gmail.com", password: "password" });
  });

  // Clean up: Delete the user after all tests
  afterAll(async () => {
      clearDB(mongodb);
      await mongodb.connection.close();
  });

  it("should create a post", async () => {
      const postDetails = { title: "New Post", body: "This is the content of the new post." };
      const response = await createPost(accessToken, postDetails);
      expect(response.status).toBe(201);
      createdPostId = response.body.post._id; // Save the ID for later tests
  });

  it("should delete a post", async () => {
      const response = await deletePost(accessToken, createdPostId);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Blog Deleted");
  });

  it("should retrieve all posts", async () => {
      const response = await getAllPosts(accessToken);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.posts)).toBeTruthy();
      expect(response.body.posts.length).toBeGreaterThanOrEqual(0);
  });

  it("should fail to perform operations without Bearer token", async () => {
      const postResponse = await request(app).post("/api/blogs").send({ title: "Unauthorized Post", body: "This should fail." });
      const deleteResponse = await request(app).delete(`/api/blogs/${createdPostId}`);
      const getResponse = await request(app).get("/api/blogs");

      expect(postResponse.status).toBe(401);
      expect(deleteResponse.status).toBe(401);
      expect(getResponse.status).toBe(401);
  });
});

