// import necessary modules
import mongoose from "mongoose";
import dotenv from "dotenv";

//load secrets from .env file
dotenv.config(); // dotenv package is no longer neccesary in newer version of node

// create connection instance to cloud mongoDB instance as described by documentation
export const connect = async (uri) => {
  
  const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  };
  return await mongoose.connect(uri, clientOptions);
};
