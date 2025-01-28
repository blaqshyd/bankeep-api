import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import constants from "../constants.js";

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(constants.UNAUTHORIZED);
        throw new Error("User is not authorized");
      }
      req.user = decoded.user;
      next();
    });

    if (!token) {
      res.status(constants.UNAUTHORIZED);
      throw new Error("User not authorized or missing token");
    }
  }
});

export default validateToken;
