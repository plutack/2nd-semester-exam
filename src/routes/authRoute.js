// import necessary modules
import { Router } from "express";
import * as authController from "../controller/authController.js";
import { loginSchema, registerSchema } from "../validation/authValidation.js";
import { generateMiddleware } from "../middleware/routeMiddleware.js";
const authRoute = Router();





// match routes to their respective controller
authRoute.post(
  "/register",
  generateMiddleware(registerSchema),
  authController.register,
);

authRoute.post("/login", generateMiddleware(loginSchema), authController.login);

export default authRoute;
