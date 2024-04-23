// import necessary modules
import { Router } from "express";
import * as apiBlogController from "../controller/apiBlogController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const draftRoute = Router();

// match route to their respective controller and add auth middleware to protected routes
// draftRoute.get("/:id", authMiddleware, blogController.getSingleBlog);
// draftRoute.patch("/:id", authMiddleware, blogController.updateBlog);
// draftRoute.delete("/:id", authMiddleware, blogController.deleteBlog);
draftRoute.get("/", authMiddleware, apiBlogController.getAllUserBlogs);

export default draftRoute;
