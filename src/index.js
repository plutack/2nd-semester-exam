// import necessary modules
import express from "express";
import dotenv from "dotenv";
import { connect } from "./database/connection.js";
import authRoute from "./routes/auth_route.js";
import postRoute from "./routes/post_route.js";
import draftRoute from "./routes/draftRoute.js";
import { userSeeder } from "./seeder/adminSeeder.js";
import { malformedBodyChecker } from "./middleware/errorMiddleware.js";
// load .env file
dotenv.config();

// declare variables
const app = express();
const port = process.env.PORT;

// middlewares
app.use(express.json());

// routes
app.use("/", authRoute);
app.use("/posts", postRoute);
app.use("/drafts", draftRoute);
// error checker
app.use(malformedBodyChecker);

// initialize connection to database and start express instance
connect()
  .then(() => {
    console.log("database successfully connected");
    userSeeder();
    app.listen(port, () => console.log(`Server running on port: ${port}`));
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
