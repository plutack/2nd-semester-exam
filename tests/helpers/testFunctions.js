export async function loginUser(userData) {
    const loginResponse = await request(app).post("/login").send(userData);
    return loginResponse.body.data.accessToken;
}

export async function createPost(accessToken, postDetails) {
    return await request(app)
        .post("/api/blogs")
        .send(postDetails)
        .set("Authorization", `Bearer ${accessToken}`);
}

export async function deletePost(accessToken, postId) {
    return await request(app)
        .delete(`/api/blogs/${postId}`)
        .set("Authorization", `Bearer ${accessToken}`);
}

export async function getAllPosts(accessToken) {
    return await request(app)
        .get("/api/blogs")
        .set("Authorization", `Bearer ${accessToken}`);
}

export async function clearDB(mongodb) {
    if (mongodb) {
      const collections = await mongodb.connection.db.collections();
      for (let collection of collections) {
        await collection.deleteMany();
      }
    }
  };