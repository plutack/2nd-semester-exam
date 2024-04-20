import { connect } from "../database/connection.js";
import bcrypt from "bcrypt";
export const userSeeder = async () => {
  const admin = {
    firstName: process.env.ADMIN_FIRSTNAME,
    lastName: process.env.ADMIN_LASTNAME,
    email: process.env.ADMIN_EMAIL,
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
    role: "ADMIN",
  };
  const mongoDB = await connect(process.env.MONGO_URL);
  const userModel = mongoDB.connection.db.collection("users");

  if (await userModel.findOne({ email: admin.email })) {
    console.log("Admin already exists");
    return;
  }

  const createdAdmin = await userModel.insertOne(admin);
  console.log("Admin created successfully", createdAdmin);
};
