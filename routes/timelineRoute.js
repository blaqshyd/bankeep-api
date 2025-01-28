import express from "express";
import constants from "../constants.js";
import tokenValidator from "../middleware/tokenValidator.js";


const timelineRouter = express.Router();

timelineRouter.get("/", tokenValidator, async (req, res) => {
  const response = await observeAxios(axios).get(
    "https://jsonplaceholder.typicode.com/posts"
  );

  res.status(constants.OK).json({
    code: res.statusCode,
    success: true,
    message: res.statusMessage,
    data: response.data,
  });
}).post("/create-post", tokenValidator, async (req, res) => {});


export default timelineRouter;