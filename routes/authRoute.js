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
      return res
        .status(constants.UNAUTHORIZED)
        .json({ message: "Username is taken!" });
    }

    let user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    user = await user.save();
    res.json(user);
  } catch (err) {
    res.status(constants.SERVER_ERROR).json({ err: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailExists = await User.findOne({ email });

    if (!email || !password) {
      res.status(constants.UNAUTHORIZED);
    }

    if (!emailExists) {
      return res
        .status(constants.UNAUTHORIZED)
        .json({ message: "User with this email does not exist" });
    }
    const correctPassword = await bcryptjs.compare(password, User.password);

    if (!correctPassword) {
      return res
        .status(constants.UNAUTHORIZED)
        .json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: User._id }, process.env.PASSWORD_KEY);
    res.json({ token, ...User._doc });
    console.log(token);
  } catch (err) {
    res.status(constants.SERVER_ERROR).json({ err: err.message });
  }
});


export default authRouter;