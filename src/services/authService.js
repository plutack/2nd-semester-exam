// import necessary modules
import Jwt from "jsonwebtoken";
import User from "../database/models/userModel.js";
import bcrypt from "bcrypt";
import { ErrorWithStatusCode } from "../exceptions/customErrorConstructor.js";
import process from "node:process"

export const register = async (
  firstName,
  lastName,
  username,
  email,
  password,
  confirmPassword,
) => {
  const user = await User.findOne({ email });
  if (password !== confirmPassword) {
    throw new ErrorWithStatusCode("Password does not match", 400);
  }
  if (user) {
    throw new ErrorWithStatusCode("user already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  // delete newUser.password;
  return newUser;
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new ErrorWithStatusCode("Unauthorized", 401);
  }
  const JWTSecret = process.env.JWTSECRET || "secret";
  const accessToken = Jwt.sign(
    {
      role: user.role || "USER",
      email: user.email,
      _id: user._id,
    },
    JWTSecret,
    {
      expiresIn: "60m",
    },
  );
  return {
    accessToken,
    user,
  };
};
