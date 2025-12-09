import constants from "../constants.js";
import errorHandler from "../middleware/errorHandler.js";
import Timeline from "../models/timelineSchema.js";

export const getTimeline = async (req, res) => {
  try {
    const posts = await Timeline.find();

    res.status(constants.OK).json({
      code: res.statusCode,
      success: true,
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!content || !author) {
      return res
        .status(constants.BAD_REQUEST)
        .json({ message: "Content and author are required" });
    }

    const newPost = new Timeline({
      title,
      content,
      author,
    });

    const savedPost = await newPost.save();

    res.status(constants.CREATED).json({
      code: res.statusCode,
      success: true,
      message: "Post created successfully",
      post: savedPost,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;

    if (!content || !author) {
      return res.status(constants.BAD_REQUEST).json({ message: "Content and author are required" });
    }

    const updatedPost = await Timeline.findByIdAndUpdate(
      id,
      { title, content, author },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(constants.NOT_FOUND).json({ message: "Post not found" });
    }

    res.status(constants.OK).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
