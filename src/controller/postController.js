// import necessary modules
import * as postService from "../services/postService.js";

// create function to handle creating posts /posts route
export const createPost = async (req, res) => {
  try {
    const user = req.user;
    const { title, body, description, tags } = req.body;
    const data = await postService.createPost(
      title,
      body,
      description,
      tags,
      user,
    );
    res.json({
      message: "Post created",
      data,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const getAllUserDraftPosts = async (req, res) => {
  try {
    const {
      limit = 20,
      page = 1,
      order = "desc",
      orderBy = "createdAt",
    } = req.query;
    const user = req.user;
    logger.info(user);
    const data = await postService.getAllPosts({
      limit,
      page,
      order,
      orderBy,
      state: "draft",
      userId: user._id,
    });
    res.json({
      message: "All posts",
      data,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
// create function to handle updating posts /posts route
export const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const updateFields = req.body; // This contains the fields to update

    // Check if at least one valid field is provided
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "At least one field must be provided for update." });
    }

    // Assuming the updatePost service updates the fields provided and handles errors internally
    const data = await postService.updatePost(id, updateFields);
    res.json({
      message: "Post updated successfully",
      data,
    });
  } catch (err) {
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
      limit = 20,
      page = 1,
      order = "desc",
      orderBy = "createdAt",
    } = req.query;
    const data = await postService.getAllPosts({ limit, page, order, orderBy });
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
    const user = req.user;
  
    const id = req.params.id;
    const data = await postService.getSinglePost(id, user);
    res.json({
      message: "Post",
      data,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
