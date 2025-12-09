import mongoose from "mongoose";

const connectDb = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    
    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
    });
    console.log(
      "Database connected:",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.error("Database connection error:", err.message);
    // Don't exit in serverless environment, just log the error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

export default connectDb;
