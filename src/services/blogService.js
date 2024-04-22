// import necessary modules
import Post from "../database/models/blogModel.js";
import { ErrorWithStatusCode } from "../exceptions/customErrorConstructor.js";
export const getAllPosts = async ({
  limit,
  page,
  order,
  orderBy,
  state,
  userId,
}) => {
  const skip = (page - 1) * limit;
  const allowedOrderFields = ["createdAt", "readingCount", "readingTime"];
  if (!allowedOrderFields.includes(orderBy)) {
    throw new ErrorWithStatusCode(
      `Bad request: Ordering by ${orderBy} is not supported.`,
      400,
    );
  }

  const sortOptions = { [orderBy]: order === "desc" ? -1 : 1 };
  const filterOptions = {};
  if (state) {
    filterOptions.state = state;
  }
  if (userId) {
    filterOptions.author = userId;
  }

  const posts = await Post.find(filterOptions)
    .populate("author", "") // Assuming you want to include the user's name
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  return posts;
};

export const getSinglePost = async (id, user) => {
  const post = await Post.findById(id).populate("author", "");
  if (!post) {
    throw new ErrorWithStatusCode("Post not found", 400);
  }
  if (user.email === post?.author?.email && post?.state === "draft") {
    return post;
  }
  if (!post || post?.state === "draft") {
    throw new ErrorWithStatusCode("Post not found", 400);
  }
  post.readCount += 1;
  await post.save();
  return post;
};

export const getAllUserDraftPost = async (username, user) => {
  if (username === user.username) {
    await getAllPosts({ userId: user.id });
  } else {
    await getAllPosts({
      state: "Published",
      userId: user.id,
    });
  }
};

export const updatePost = async (id, updateField) => {
  const post = await Post.findByIdAndUpdate(id, updateField).populate(
    "user",
    "",
  );
  return post;
};

export const deletePost = async (id) => {
  const post = await Post.findByIdAndDelete(id).populate("author", "");
  return post;
};

export const createPost = async (title, body, description, tags, user) => {
  const newPost = new Post({
    title,
    body,
    description,
    tags,
    author: user,
  });
  await newPost.save();
  await newPost.populate("author", "");
  return newPost;
};
