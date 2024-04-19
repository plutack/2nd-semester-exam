import { connect } from "../database/connection.js";

export async function userSeeder() {
  const admin = {
    firstName: process.env.ADMIN_FIRSTNAME,
    lastName: process.env.ADMIN_LASTNAME,
    email: process.env.ADMIN_LASTNAME,
    password: process.env.ADMIN_PASSWORD,
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
}
