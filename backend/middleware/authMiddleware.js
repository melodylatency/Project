import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.operation;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        res.status(401);
        throw new Error("User does not exist. Please log in again.");
      }

      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, invalid token.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, token missing.");
  }
});

export { protect };
