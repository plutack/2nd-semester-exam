import { connect } from "../database/connection.js";
import bcrypt from "bcrypt";
import logger from "../middleware/loggerMiddleware.js";

export const userSeeder = async () => {
  const admin = {
    firstName: process.env.ADMIN_FIRSTNAME,
    lastName: process.env.ADMIN_LASTNAME,
    email: process.env.ADMIN_EMAIL,
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
    role: "ADMIN",
  };
  const mongoDB = await connect(process.env.MONGODB_URI);
  const userModel = mongoDB.connection.db.collection("users");

  if (await userModel.findOne({ email: admin.email })) {
    logger.info("Admin already exists");
    return;
  }

  const createdAdmin = await userModel.insertOne(admin);
  console.log("Admin created successfully", createdAdmin);
};
