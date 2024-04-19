// import necessary modules
import { Router } from "express";
import * as authController from "../controller/auth_controller.js";
import { loginSchema, registerSchema } from "../validation/authValidation.js";
import { generateMiddleWare } from "../middleware/routeMiddleware.js";
const authRoute = Router();

// match routes to their respective controller
authRoute.post(
  "/register",
  generateMiddleWare(registerSchema),
  authController.register,
);
authRoute.post("/login", generateMiddleWare(loginSchema), authController.login);

export default authRoute;
