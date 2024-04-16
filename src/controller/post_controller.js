// import necessary modules
import * as postService from "../services/post_service.js";

// create function to handle creating posts /posts route
export const createPost = async (req, res) => {
  try {
    const user = req.user;
    const { title, body } = req.body;
    const data = await postService.createPost(title, body, user);
    res.json({
      message: "Post created",
      data,
    });
  } catch (err) {
    // handle validation errrors seperately
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// create function to handle updating posts /posts route
export const updatePost = async (req, res) => {
  try {
    let data;
    const id = req.params.id;
    const { title, body } = req.body;
    // handling missing payload by validating the payload
    if (!title && !body) {
      return res
        .status(400)
        .json({ message: "Either title or body must be provided" });
    }
    // only one can be changed according to specifications
    if (title) {
      data = await postService.updatePost(id, { title });
    }
    if (body) {
      data = await postService.updatePost(id, { body });
    }
    res.json({
      message: "Post updated successfully",
      data,
    });
  } catch (err) {
    // handle validation errors seperately
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// create function to handle delete post on /posts route
export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    await postService.deletePost(id);
    const data = await postService.getAllPosts();
    res.json({
      message: "Post deleted successfully",
      data,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// create function to handle get all posts on /posts route
export const getAllPosts = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      order = "desc",
      orderBy = "createdAt",
    } = req.query;
    const data = await postService.getAllPosts({ limit, page, order, orderBy });
    console.log(data);
    res.json({
      message: "All posts",
      data,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// create function to handle get a single post on /posts route
export const getSinglePost = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await postService.getSinglePost(id);
    res.json({
      message: "Post",
      data,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
