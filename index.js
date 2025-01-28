import { APIToolkit, observeAxios, ReportError } from "apitoolkit-express";
import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import connectDb from "./config/dbConnection.js";
import constants from "./constants.js";
import authRoute from "./routes/authRoute.js";
import protectedRoute from "./routes/protectedRoute.js";
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

// Initialize APIToolkit client
const apitoolkitClient = APIToolkit.NewClient({
  name: "Bankeep API",
  apiKey: process.env.API_KEY, 
  redactHeaders: ["Authorization"],
  redactResponseBody: ["$.user.email", "$.user.age"],
  redactRequestBody: ["$.password", "$.credit_card", "$.ccv"],
  debug: true,
});

// Middleware to parse JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use APIToolkit middleware
app.use(apitoolkitClient.expressMiddleware);

// Swagger UI setup

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read swagger.json file
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./swagger/swagger.json"), "utf8")
);

// Mount auth routes
app.use("/api/auth", authRoute);

// Mount user routes
app.use("/api/user", userRoute);

// Mount timeline routes
app.use("/api/timeline", timelineRoute);

// Mount protected routes
app.use("/api/protected", protectedRoute);

// Root route with error handling
app.get("/api/health", (req, res) => {
  try {
    res.status(200).json({
      code: res.statusCode,
      success: true,
      message: res.statusMessage,
      data: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Manually report errors to APItoolkit
    ReportError(error);
    // Send a structured error response
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: null,
      error: {
        code: error.code || 500,
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
    });
  }
});

app.get("/api/post", async (req, res) => {
  const response = await observeAxios(axios).get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );

  res.status(constants.OK).json({
    code: res.statusCode,
    success: true,
    message: res.statusMessage,
    data: response.data,
  });
});


// Swagger UI setup
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Automatically report unhandled errors
// Error handler must be before any other error middleware and after all controllers
app.use(apitoolkitClient.errorHandler);


const server = createServer(app);
server.listen(port);
server.on("listening", () => {
  console.log("BanKeep API listening on port", port);
});
