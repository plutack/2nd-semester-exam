// import necessary modules
import { Router } from "express";
import * as postController from "../controller/post_controller.js";
import { authMiddleware } from "../middleware/auth_middleware.js";

const postRoute = Router();

// match route to their respective controller and add auth middleware to protected routes
postRoute.post("/", authMiddleware, postController.createPost);
postRoute.get("/:id", authMiddleware, postController.getSinglePost);
postRoute.patch("/:id", authMiddleware, postController.updatePost);
postRoute.delete("/:id", authMiddleware, postController.deletePost);
postRoute.get("/", postController.getAllPosts);

export default postRoute;
