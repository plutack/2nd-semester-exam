// import necessary modules
import { Router } from "express";
import * as postController from "../controller/blogController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const draftRoute = Router();

// match route to their respective controller and add auth middleware to protected routes
draftRoute.get("/:id", authMiddleware, postController.getSinglePost);
draftRoute.patch("/:id", authMiddleware, postController.updatePost);
draftRoute.delete("/:id", authMiddleware, postController.deletePost);
draftRoute.get("/", authMiddleware, postController.getAllUserDraftPosts);

export default draftRoute;
