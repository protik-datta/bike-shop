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

const AppError = require("./src/utils/AppError");

const app = express();

// cors
app.use(
  cors({
    origin: "*",
  }),
);

// security
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());

// compression
app.use(compression());

// body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// cookie parser
app.use(cookieParser());

// rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 500,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
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
    timestamp: new Date().toISOString(),
  });
});

// routes
const bikeRoutes = require("./src/routes/bikes.routes");
app.use("/api/v1/bikes", bikeRoutes);
const categoryRoutes = require("./src/routes/category.routes");
app.use("/api/v1/categories", categoryRoutes);
const orderRoutes = require("./src/routes/order.routes");
app.use("/api/v1/orders", orderRoutes);

// 404 Catch-All Handler — Express 5 requires named wildcard, bare "*" is invalid
app.use("/{*path}", (req, res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

// global error handler
const errorHandler = require("./src/middlewares/errorHandler.middleware");
app.use(errorHandler);

module.exports = app;
