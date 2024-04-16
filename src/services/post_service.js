// import necessary modules
import Post from "../database/schema/post_schema.js";

export const getAllPosts = async ({
  limit = 10,
  page = 1,
  order = "desc",
  orderBy = "createdAt",
}) => {
  const skip = (page - 1) * limit;
  const sortOptions = { [orderBy]: order };

  const posts = await Post.find({})
    .populate("user", "")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  return posts;
};

export const getSinglePost = async (id) => {
  const post = await Post.findById(id).populate("user", "");
  return post;
};

export const updatePost = async (id, updateField) => {
  const post = await Post.findByIdAndUpdate(id, updateField).populate(
    "user",
    "",
  );
  return post;
};

export const deletePost = async (id) => {
  const post = await Post.findByIdAndDelete(id).populate("user", "");
  return post;
};

export const createPost = async (title, body, user) => {
  console.log(user);
  const newPost = new Post({
    title,
    body,
    user,
  });
  await newPost.save();
  await newPost.populate("user", "");
  return newPost;
};
