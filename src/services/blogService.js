// import necessary modules
import Blog from "../database/models/blogModel.js";
import { ErrorWithStatusCode } from "../exceptions/customErrorConstructor.js";
export const getAllBlogs = async ({
  limit,
  page,
  order,
  orderBy,
  state="Published",
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

  const blogs = await Blog.find(filterOptions)
    .populate("author", "") // Assuming you want to include the user's name
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  return blogs;
};

export const getSingleBlog = async (id) => {
  const blog = await Blog.findById(id).populate("author", "");
  if (!Blog) {
    throw new ErrorWithStatusCode("blog not found", 400);
  }
  // if (user.email === blog?.author?.email && blog?.state === "draft") {
  //   return blog;
  // }
  if ( blog?.state === "draft") {
    throw new ErrorWithStatusCode("blog not found", 400);
  }
  blog.readCount += 1;
  await blog.save();
  return blog;
};

export const getAllUserDraftBlog = async (username, user) => {
  if (username === user.username) {
    await getAllBlogs({ userId: user.id });
  } else {
    await getAllBlogs({
      state: "Published",
      userId: user.id,
    });
  }
};

export const updateBlog = async (id, updateField) => {
  const blog = await Blog.findByIdAndUpdate(id, updateField).populate(
    "user",
    "",
  );
  return blog;
};

export const deleteBlog = async (user, id) => {
  const blog = await Blog.findById(id).populate("author", "");
  console.log(blog.author.id, user._id, user.role)
  if (blog.author.id === user._id || user.role === "ADMIN") {
    await Blog.findByIdAndDelete(id).populate("author", "");
  return ;
  }
  throw new ErrorWithStatusCode("Unauthorized", 401);
};

export const createBlog = async (title, body, description, tags, user) => {
  const newBlog = new Blog({
    title,
    body,
    description,
    tags,
    author: user,
  });
  await newBlog.save();
  await newBlog.populate("author", "");
  return newBlog;
};
