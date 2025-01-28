import express from "express";
import constants from "../constants.js";
import tokenValidator from "../middleware/tokenValidator.js";

const userRouter = express.Router();

userRouter.get("/details", tokenValidator, async (req, res) => {
  try {
 
    res.json({
      code: res.statusCode,
      status: "true",
      message: "Operation succesfful",
      data: req.user,
    });
  } catch (err) {
    res.status(constants.SERVER_ERROR).json({ error: err.message });
  }
});

export default userRouter;
