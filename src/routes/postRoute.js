// import necessary modules
import { Router } from "express";
import * as postController from "../controller/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { generateMiddleware } from "../middleware/routeMiddleware.js";
import { postValidationSchema } from "../validation/postValidation.js";
import { validateUpdateFields } from "../middleware/updateMiddleware.js";
const postRoute = Router();

// match route to their respective controller and add auth middleware to protected routes
postRoute.post(
  "/",
  authMiddleware,
  generateMiddleware(postValidationSchema),
  postController.createPost,
);
postRoute.get("/:id", authMiddleware, postController.getSinglePost);
postRoute.patch("/:id",authMiddleware, validateUpdateFields, postController.updatePost);
postRoute.delete("/:id", postController.deletePost);
postRoute.get("/", postController.getAllPosts);

export default postRoute;
