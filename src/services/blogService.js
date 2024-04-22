// import necessary modules
import Blog from "../database/models/blogModel.js";
import { ErrorWithStatusCode } from "../exceptions/customErrorConstructor.js";
export const getAllBlogs = async ({
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

  const blogs = await Blog.find(filterOptions)
    .populate("author", "") // Assuming you want to include the user's name
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  return blogs;
};

export const getSingleBlog = async (id, user) => {
  const blog = await Blog.findById(id).populate("author", "");
  if (!Blog) {
    throw new ErrorWithStatusCode("blog not found", 400);
  }
  if (user.email === blog?.author?.email && blog?.state === "draft") {
    return blog;
  }
  if (!blog || blog?.state === "draft") {
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

export const updateblog = async (id, updateField) => {
  const blog = await blog.findByIdAndUpdate(id, updateField).populate(
    "user",
    "",
  );
  return blog;
};

export const deleteblog = async (id) => {
  const blog = await blog.findByIdAndDelete(id).populate("author", "");
  return blog;
};

export const createblog = async (title, body, description, tags, user) => {
  const newblog = new blog({
    title,
    body,
    description,
    tags,
    author: user,
  });
  await newblog.save();
  await newblog.populate("author", "");
  return newblog;
};
