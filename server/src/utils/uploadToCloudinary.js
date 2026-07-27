const cloudinary = require("../config/cloudinary.config");
const streamifier = require("streamifier");
const logger = require("../utils/logger");

// Single Image Upload
const uploadToCloudinary = (buffer, folder = "bikes") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Multiple Images Upload
const uploadMultipleToCloudinary = async (files, folder = "bikes") => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, folder),
  );

  return await Promise.all(uploadPromises);
};

// Delete Single Image
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    logger.error(`[Cloudinary] Delete failed for "${publicId}":`, err.message);
  }
};

// Delete Multiple Images
const deleteMultipleFromCloudinary = async (publicIds = []) => {
  if (!publicIds || publicIds.length === 0) return;
  try {
    await cloudinary.api.delete_resources(publicIds);
  } catch (err) {
    logger.error("[Cloudinary] Failed to delete multiple assets:", err.message);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
};
