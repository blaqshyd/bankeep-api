import { APIToolkit } from "apitoolkit-express";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import connectDb from "./config/dbConnection.js";
import errorHandlerr from "./middleware/errorHandler.js";
import authRoute from "./routes/authRoute.js";
import healthRoute from "./routes/healthRoute.js";
import timelineRoute from "./routes/timelineRoute.js";
import userRoute from "./routes/userRoute.js";

// Load environment variables from .env file
dotenv.config();

// Establish database connection
connectDb();

// Create an Express application
const app = express();

// Define the port number
const port = process.env.PORT || 5000;

// Initialize APIToolkit client (only if API_KEY is available)
let apitoolkitClient;
if (process.env.API_KEY) {
  try {
    apitoolkitClient = APIToolkit.NewClient({
      name: "Bankeep API",
      apiKey: process.env.API_KEY,
      redactHeaders: ["Authorization"],
      redactResponseBody: ["$.user.email", "$.user.age"],
      redactRequestBody: ["$.password", "$.credit_card", "$.ccv"],
      debug: false, // Disable debug in production
    });
  } catch (err) {
    console.error("APIToolkit initialization error:", err.message);
    apitoolkitClient = null;
  }
} else {
  console.warn("API_KEY not found, APIToolkit disabled");
  apitoolkitClient = null;
}

// Middleware to parse JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use APIToolkit middleware (only if available)
if (apitoolkitClient) {
  app.use(apitoolkitClient.expressMiddleware);
}

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read swagger.json file
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./swagger/swagger.json"), "utf8")
);

// Mount routes
app.use("/api/health", healthRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/timeline", timelineRoute);

// Swagger UI setup
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Automatically report unhandled errors
//* Error handler must be before any other error middleware and after all controllers
if (apitoolkitClient) {
  app.use(apitoolkitClient.errorHandler);
}
app.use(errorHandlerr);

// Export for serverless (Vercel)
export default app;

// Create and start the server (only for local development)
if (process.env.NODE_ENV !== 'production') {
  const server = createServer(app);
  server.listen(port, () => {
    console.log(`BanKeep API listening on port: ${port}`);
  });
}
