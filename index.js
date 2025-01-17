import { APIToolkit, observeAxios, ReportError } from "apitoolkit-express";
import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import connectDb from "./config/dbConnection.js";
import authRoute from "./routes/authRoute.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// Load environment variables from .env file
dotenv.config();

// Establish database connection
connectDb();

// Create an Express application
const app = express();

// Define the port number
const port = process.env.PORT || 5000;

// Initialize APIToolkit client
const apitoolkitClient = APIToolkit.NewClient({ apiKey: process.env.API_KEY });

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
// Swagger UI setup
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount auth routes
app.use("/api/users", authRoute);

// Root route with error handling
app.get("/api/", (req, res) => {
  try {
    let inf = 1 / 0;
    res.send("The impossible number is: " + inf);
  } catch (error) {
    // Manually report errors to APItoolkit
    ReportError(error);
    res.send("Something went wrong");
  }
});

app.get("/api/post", async (req, res) => {
  const response = await observeAxios(axios).get(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  res.send(response.data);
});

// Automatically report unhandled errors
// Error handler must be before any other error middleware and after all controllers
app.use(apitoolkitClient.errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
