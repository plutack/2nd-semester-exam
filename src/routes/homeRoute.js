// import necessary modules
import { Router } from "express";

const homeRoute= Router();

// match routes to their respective controller

homeRoute.get("/", (req, res)=>{
    res.render("index", {title: "Home Page", message: "Welcome to the home page of this blog site"});});

export default homeRoute;
