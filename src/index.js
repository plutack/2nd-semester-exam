// import necessary modules
import express from "express";
import dotenv from "dotenv";
import { connect } from "./database/connection.js";
import authRoute from "./routes/auth_route.js";
import postRoute from "./routes/post_route.js";
import draftRoute from "./routes/draftRoute.js";
import { userSeeder } from "./seeder/adminSeeder.js";
import { malformedBodyChecker } from "./middleware/errorMiddleware.js";
import homeRoute from "./routes/homeRoute.js";
import path from "path";
// load .env file
dotenv.config();

// declare variables
const app = express();
const port = process.env.PORT;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src", "public")));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));
// routes
app.use("/", homeRoute);
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
