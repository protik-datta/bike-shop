const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `A record with that ${field} already exists`;
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Handle Multer errors
  if (err.name === "MulterError") {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
  }

  // Handle malformed JSON body (SyntaxError from body-parser)
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  // In production, don't leak internal details for non-operational errors
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && !err.isOperational && statusCode === 500) {
    message = "An unexpected error occurred. Please try again later.";
  }

  // Log 5xx as errors, 4xx as warnings
  const logMsg = `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`;
  if (statusCode >= 500) {
    logger.error(logMsg, { stack: err.stack });
  } else {
    logger.warn(logMsg);
  }

  const response = {
    success: false,
    message,
  };

  // Only include stack trace in non-production environments
  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;

