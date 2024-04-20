// import necessary modules
import Jwt from "jsonwebtoken";
import * as authService from "../services/auth_service.js";
import bcrypt from "bcrypt";

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
    res.json({
      message: "User created succesfully",
      data: newUser,
    });
  } catch (err) {
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
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
