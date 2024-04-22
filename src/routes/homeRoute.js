// import necessary modules
import { Router } from "express";

const homeRoute= Router();

homeRoute.get("", (req, res)=>{
    res.render("index")
})

export default homeRoute;
