const multer = require("multer");
const AppError = require("../utils/AppError");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
});

const uploadBikeImages = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

module.exports = { uploadBikeImages };
