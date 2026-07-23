const AppError = require("../utils/AppError");

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      return next(new AppError(400, messages));
    }

    req[source] = result.data;
    next();
  };

module.exports = validate;
