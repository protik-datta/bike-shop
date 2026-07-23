const router = require("express").Router();
const bikeController = require("../controllers/bike.controller");
const validate = require("../middlewares/validate.middleware");
const { uploadBikeImages } = require("../middlewares/upload.middleware");
const {
  createBikeSchema,
  updateBikeSchema,
} = require("../validation/bike.validation");

// Create a new bike
router.post(
  "/",
  uploadBikeImages,
  validate(createBikeSchema),
  bikeController.createBike,
);

// Get all bikes
router.get("/", bikeController.getBikes);

// Get a bike by Slug
router.get("/:slug", bikeController.getBikeBySlug);

// Update a bike by ID
router.put(
  "/:id",
  uploadBikeImages,
  validate(updateBikeSchema),
  bikeController.updateBike,
);

// Delete a bike by ID
router.delete("/:id", bikeController.deleteBike);

module.exports = router;
