// import necessary modules
import Jwt from "jsonwebtoken";
import User from "../database/schema/user_schema.js";
import bcrypt from "bcrypt";
import { ErrorWithStatusCode } from "../exceptions/customErrorConstructor.js";

export const register = async (
  name,
  email,
  password,
  confirmPassword,
  role,
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
    email,
    password: hashedPassword,
  });
  await newUser.save();
  delete newUser.password;
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
