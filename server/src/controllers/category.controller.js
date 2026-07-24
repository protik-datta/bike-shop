const Category = require("../model/category.model");
const redis = require("../config/redis.config");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { invalidateCache, CACHE_TTL } = require("../utils/cache");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/uploadToCloudinary");

// CREATE CATEGORY
exports.createCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError(400,"Category image file is required"));
  }

  const result = await uploadToCloudinary(req.file.buffer, "categories");

  const category = await Category.create({
    ...req.body,
    image: result.secure_url,
    imagePublicId: result.public_id,
  });

  await invalidateCache("categories:*");

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

// GET ALL CATEGORIES
exports.getCategories = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const { search, isActive } = req.query;

  const sortedQuery = Object.keys(req.query)
    .sort()
    .reduce((acc, key) => {
      acc[key] = req.query[key];
      return acc;
    }, {});

  const cacheKey = `categories:list:${JSON.stringify(sortedQuery)}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return res.status(200).json({
      success: true,
      cached: true,
      ...JSON.parse(cached),
    });
  }

  const filter = {};

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true";
  } else {
    filter.isActive = true;
  }

  if (search) {
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.name = { $regex: safeSearch, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Category.countDocuments(filter),
  ]);

  const payload = {
    data: categories,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  await redis.set(cacheKey, JSON.stringify(payload), "EX", CACHE_TTL);

  return res.status(200).json({
    success: true,
    cached: false,
    ...payload,
  });
});

// GET SINGLE CATEGORY BY SLUG
exports.getCategoryBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const cacheKey = `categories:single:${slug}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return res
      .status(200)
      .json({ success: true, cached: true, data: JSON.parse(cached) });
  }

  const category = await Category.findOne({ slug, isActive: true }).lean();

  if (!category) {
    return next(new AppError(404, "Category not found"));
  }

  await redis.set(cacheKey, JSON.stringify(category), "EX", CACHE_TTL);

  res.status(200).json({ success: true, cached: false, data: category });
});

// UPDATE CATEGORY
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const existingCategory = await Category.findById(req.params.id);

  if (!existingCategory) {
    return next(new AppError(404, "Category not found"));
  }

  const updateData = { ...req.body };

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "categories");
    updateData.image = result.secure_url;
    updateData.imagePublicId = result.public_id;

    if (existingCategory.imagePublicId) {
      deleteFromCloudinary(existingCategory.imagePublicId);
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true },
  ).lean();

  await invalidateCache("categories:*");

  await redis.del(`categories:single:${existingCategory.slug}`);
  if (updatedCategory.slug && updatedCategory.slug !== existingCategory.slug) {
    await redis.del(`categories:single:${updatedCategory.slug}`);
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: updatedCategory,
  });
});

// DELETE CATEGORY (SOFT DELETE)
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  ).lean();

  if (!category) {
    return next(new AppError(404, "Category not found"));
  }

  await invalidateCache("categories:*");

  if (category.slug) {
    await redis.del(`categories:single:${category.slug}`);
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: category,
  });
});
