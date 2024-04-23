// import necessary modules
import { Router } from "express";
import * as apiBlogController from "../controller/apiBlogController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const apiMyBlogRoute = Router();

apiMyBlogRoute.get("/",authMiddleware, apiBlogController.getAllUserBlogs);

export default apiMyBlogRoute;
