// import necessary modules
import * as authService from "../services/authService.js";
import logger from "../middleware/loggerMiddleware.js";


// create function to handle /register route
export const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, confirmPassword } =
      req.body;
    const newUser = await authService.register(
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
    );
    res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    logger.error(err)
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// create function to handle /login route
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json({
      message: "Login Successful",
      data,
    });
  } catch (err) {
    logger.error(err)
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
