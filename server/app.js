require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("@exortek/express-mongo-sanitize");
const logger = require("./src/utils/logger");

const app = express();

// cors
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// security
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());

// compression
app.use(compression());

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

// rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100000,
});
app.use(limiter);

// logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// health check api
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

// global error handler
const errorHandler = require("./src/middlewares/errorHandler.middleware");
app.use(errorHandler);

module.exports = app;
