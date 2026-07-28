const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if DB is unreachable
    });
    logger.info("MongoDB connected successfully");

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;

