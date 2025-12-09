import express from "express";
import { getHealthStatus } from "../controllers/healthController.js";

const healthRouter = express.Router();

healthRouter.get("/", getHealthStatus);

export default healthRouter; 