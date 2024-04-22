// import necessary modules
import { Router } from "express";
import * as apiBlogController from "../controller/apiBlogController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { generateMiddleware } from "../middleware/routeMiddleware.js";
import { blogValidationSchema } from "../validation/blogValidation.js";
import { validateUpdateFields } from "../middleware/updateMiddleware.js";
const apiBlogRoute = Router();

// match route to their respective controller and add auth middleware to protected routes
apiBlogRoute.post(
  "/",
  authMiddleware,
  generateMiddleware(blogValidationSchema),
  apiBlogController.createBlog,
);
apiBlogRoute.get("/:id", authMiddleware, apiBlogController.getSingleBlog);
apiBlogRoute.patch("/:id",authMiddleware, validateUpdateFields, apiBlogController.updateBlog);
apiBlogRoute.delete("/:id",authMiddleware, apiBlogController.deleteBlog);
apiBlogRoute.get("/", apiBlogController.getAllBlogs);

export default apiBlogRoute;
