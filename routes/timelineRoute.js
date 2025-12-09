import express from "express";
import { createPost, editPost, getTimeline } from "../controllers/timelineController.js";
import tokenValidator from "../middleware/tokenValidator.js";

const timelineRouter = express.Router();

timelineRouter.get("/", tokenValidator, getTimeline)
              .post("/create-post", tokenValidator, createPost)
              .patch("/edit-post/:id", tokenValidator, editPost);

export default timelineRouter;