// import necessary modules
import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import blogRoute from "./routes/blogRoute.js";
import draftRoute from "./routes/draftRoute.js";
import { malformedBodyChecker } from "./middleware/errorMiddleware.js";
import homeRoute from "./routes/homeRoute.js";
import path from "path";
import logger from "./middleware/loggerMiddleware.js";
// load .env file
dotenv.config();

// declare variables
const app = express();

// middlewares
app.use((err, req, res, next) => {
  logger.error(err);
  next() // call winston to log error
});
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to properly parse from form element in ejs renders
app.use(express.static(path.join(process.cwd(), "src", "public"))); // serve css files for ejs renders
// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'));
// routes
app.use("/", homeRoute);
app.use("/", authRoute);
app.use("/blogs", blogRoute);
app.use("/drafts", draftRoute);


// error checker
app.use(malformedBodyChecker);

// initialize connection to database and start express instance


export default app