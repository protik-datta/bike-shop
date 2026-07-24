const router = require("express").Router();
const categoryController = require("../controllers/category.controller");
const uploadCategory = require("../middlewares/uploadCategory.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validation/category.validation");

// Public Routes
router.get("/", categoryController.getCategories);
router.get("/:slug", categoryController.getCategoryBySlug);

// Admin / Protected Routes
router.post(
  "/",
  uploadCategory,
  validate(createCategorySchema),
  categoryController.createCategory,
);

router.patch(
  "/:id",
  uploadCategory,
  validate(updateCategorySchema),
  categoryController.updateCategory,
);

router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
