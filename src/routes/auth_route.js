// import necessary modules
import { Router } from "express";
import * as authController from "../controller/auth_controller.js";

const authRoute = Router();

// match routes to their respective controller
authRoute.post("/register", authController.register);
authRoute.post("/login", authController.login);

export default authRoute;
