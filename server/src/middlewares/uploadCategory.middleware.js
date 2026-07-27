const multer = require("multer");
const AppError = require("../utils/AppError");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only image files are allowed!"), false);
  }
};

const uploadCategory = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
}).single("image");

module.exports = uploadCategory;
