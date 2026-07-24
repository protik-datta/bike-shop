const AppError = require("../utils/AppError");

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const issues = result.error?.issues || result.error?.errors || [];

      const messages =
        issues.length > 0
          ? issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
          : "Validation failed";

      return next(new AppError(400, messages));
    }

    req[source] = result.data;
    next();
  };

module.exports = validate;
