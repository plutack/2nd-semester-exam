// Import necessary modules
import Jwt from "jsonwebtoken";
import logger from "./loggerMiddleware.js";

// Create middleware to intercept traffic for protected routes
export const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  // Check if the request is for a specific blog post by ID and is a GET request
  if (req.method === 'GET' && req.path.length === 25) {
    if (authorization){
      const bearerToken = authorization.split(" ");
      if (bearerToken.length !== 2) {
        res.status(401).json({ message: "Unauthorized: INVALID" });
        return; 
    }
    Jwt.verify(bearerToken[1], process.env.JWTSECRET, (err, decoded) => {
      if (err) {
        logger.error(err);
        res.status(401).json({ message: "Unauthorized: not correct" });
        return; 
      }
      req.user = decoded;
      next();
    });
    }
    next();
  } else {
    
    if (!authorization) {
      res.status(401).json({ message: "Unauthorized no authorization header" });
      return; 
    }
    const bearerToken = authorization.split(" ");
    if (bearerToken.length !== 2) {
      res.status(401).json({ message: "Unauthorized: INVALID" });
      return; 
    }
    Jwt.verify(bearerToken[1], process.env.JWTSECRET, (err, decoded) => {
      if (err) {
        logger.error(err);
        res.status(401).json({ message: "Unauthorized: not correct" });
        return; 
      }
      req.user = decoded;
      next();
    });
  }
};
