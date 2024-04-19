// import necessary modules
import { Router } from "express";
import * as postController from "../controller/post_controller.js";
import { authMiddleware } from "../middleware/auth_middleware.js";
import { generateMiddleware } from "../middleware/routeMiddleware.js";
import { postValidationSchema } from "../validation/postValidation.js";
const postRoute = Router();

// match route to their respective controller and add auth middleware to protected routes
postRoute.post(
  "/",
  generateMiddleware(postValidationSchema),
  postController.createPost,
);
postRoute.get("/:id", postController.getSinglePost);
postRoute.patch("/:id", postController.updatePost);
postRoute.delete("/:id", postController.deletePost);
postRoute.get("/", postController.getAllPosts);

export default postRoute;
