// import necessary modules
import { Router } from "express";

const homeRoute= Router();

homeRoute.get("/", (req, res) => {
    console.log("home route")
    res.render("home");
  });

homeRoute.get("/login", (req, res)=>{
    res.render("login");
  });

homeRoute.get("/register", (req, res)=>{
    res.render("register");
  });
export default homeRoute;
