import request from "supertest";
import app from "../../src/index.js";

export async function loginUser(userData) {
    const loginResponse = await request(app).post("/login").send(userData);
    return loginResponse.body.data.accessToken;
}

export async function createBlog(accessToken, blogDetails) {
    return await request(app)
        .post("/api/blogs")
        .send(blogDetails)
        .set("Authorization", `Bearer ${accessToken}`);
}

export async function deleteBlog(accessToken, blogId) {
    return await request(app)
        .delete(`/api/blogs/${blogId}`)
        .set("Authorization", `Bearer ${accessToken}`);
}

export async function getAllBlogs(accessToken) {
  if (!accessToken) return await request(app).get("/api/blogs")
  if (accessToken) {
    return await request(app)
        .get("/api/blogs")
        .set("Authorization", `Bearer ${accessToken}`);
  }
}

export async function clearDB(mongodb) {
    if (mongodb) {
      const collections = await mongodb.connection.db.collections();
      for (let collection of collections) {
        await collection.deleteMany();
      }
    }
  };