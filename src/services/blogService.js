// import necessary modules
import Blog from "../database/models/blogModel.js";
import { ErrorWithStatusCode } from "../exceptions/customErrorConstructor.js";
export const getAllPublishedBlogs = async ({
  limit,
  page,
  order,
  orderBy,
  state="published",
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

  // Initialize sortOptions as an empty object.
const sortOptions = {};

// Set the sort direction based on the value of 'order'.
let sortOrder;
if (order === "desc") {
    sortOrder = -1; // Set sortOrder to -1 for descending order.
} else if (order === "asc") {
    sortOrder = 1;  // Set sortOrder to 1 for ascending order.
} else {
    throw new ErrorWithStatusCode("Invalid Query: order value must be 'asc' or 'desc'.", 400);
}

// Assign sortOrder to the property of sortOptions with a key of orderBy.
sortOptions[orderBy] = sortOrder;

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
  if (user?.email === blog?.author?.email) {
    blog.readCount += 1;
    await blog.save();
    return blog;
  }
  if ( blog?.state === "draft") {
    throw new ErrorWithStatusCode("blog not found", 400);
  }
  blog.readCount += 1;
  await blog.save();
  return blog;
};

export const getAllUserBlogs = async (user, filterOptions) => {
  if (user) {
    // Define query object based on filter options
    const query = { author: user._id };
    if (filterOptions.state) {
      query.state = filterOptions.state;
    }

    // Pagination
    const limit = parseInt(filterOptions.limit) || 20;
    const page = parseInt(filterOptions.page) || 1;
    const skip = (page - 1) * limit;

    const userBlogs = await Blog.find(query)
      .populate("author", "name")
      .skip(skip)
      .limit(limit);

    return userBlogs;
  } 
  throw new ErrorWithStatusCode("Unauthorized", 401);
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
