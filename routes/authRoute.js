import bcryptjs from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import constants from "../constants.js";
import User from "../models/userSchema.js";

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    //* If there is a user with the same email or username
    //* It should throw corresponding error messages
    const { name, email, password, username } = req.body;
    const emailExists = await User.findOne({ email });
    const userNameExists = await User.findOne({ username });
    const hashedPassword = await bcryptjs.hash(password, 8);
    if (!name || !email || !password || !username) {
      res.status(constants.UNAUTHORIZED);
    }

    if (emailExists) {
      return res
        .status(constants.UNAUTHORIZED)
        .json({ message: "Email already exists!" });
    }
    if (userNameExists) {
      return res.status(constants.UNAUTHORIZED).json({
        code: res.statusCode,
        status: "false",
        message: "Username is taken!",
      });
    }

    let user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    user = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(constants.CREATED).json({
      code: res.statusCode,
      status: "true",
      token,
      user: { ...user._doc, password: undefined },
    });
  } catch (err) {
    res
      .status(constants.SERVER_ERROR)
      .json({ code: res.statusCode, status: "false", error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!email || !password) {
      return res.status(constants.UNAUTHORIZED).json({
        message: "Email and password are required",
      });
    }

    if (!user) {
      return res.status(constants.UNAUTHORIZED).json({
        code: res.statusCode,
        status: "false",
        message: "User with this email does not exist",
      });
    }
    const correctPassword = await bcryptjs.compare(password, user.password);

    if (!correctPassword) {
      return res.status(constants.UNAUTHORIZED).json({
        code: res.statusCode,
        status: "false",
        message: "Incorrect password",
      });
    }


    res.json({ token, user: { ...user._doc, password: undefined } });
  } catch (err) {
    res
      .status(constants.SERVER_ERROR)
      .json({ code: res.statusCode, status: "false", error: err.message });
  }
});

export default authRouter;
