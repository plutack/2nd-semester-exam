// import necessary modules
import Jwt from "jsonwebtoken";
import logger from "./loggerMiddleware.js";
// create middleware to intercept traffic for protected routes
export const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).json({ message: "Unauthorized no authorization header" });
  }
  const bearerToken = authorization.split(" ");
  if (bearerToken.length !== 2) {
    res.status(401).json({ message: "Unauthorized not 2" });
  }
  Jwt.verify(bearerToken[1], process.env.JWTSECRET, (err, decoded) => {
    if (err) {
      logger.error(err);
      res.status(401).json({ message: "Unauthorized not correct" });
    }
    req.user = decoded;
    next();
  });
};
