// import necessary modules
import { Router } from "express";
import * as blogController from "../controller/blogController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { generateMiddleware } from "../middleware/routeMiddleware.js";
import { blogValidationSchema } from "../validation/blogValidation.js";
import { validateUpdateFields } from "../middleware/updateMiddleware.js";
const blogRoute = Router();

// match route to their respective controller and add auth middleware to protected routes
// blogRoute.post(
//   "/",
//   authMiddleware,
//   generateMiddleware(blogValidationSchema),
//   blogController.createBlog,
// );
blogRoute.get("/:id", blogController.getSingleBlog);
// blogRoute.patch("/:id",authMiddleware, validateUpdateFields, blogController.updateBlog);
// blogRoute.delete("/:id", blogController.deleteBlog);
blogRoute.get("/", blogController.getAllBlogs);


export default blogRoute;