const Bike = require("../model/bike.model");
const Category = require("../model/category.model");
const redis = require("../config/redis.config");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { invalidateCache, CACHE_TTL } = require("../utils/cache");
const {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} = require("../utils/uploadToCloudinary");

// CREATE BIKE
exports.createBike = asyncHandler(async (req, res, next) => {
  let thumbnailUrl = "";
  let thumbnailPublicId = "";
  let imagesUrls = [];
  let imagesPublicIds = [];

  if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
    const thumbResult = await uploadToCloudinary(
      req.files.thumbnail[0].buffer,
      "bikes/thumbnails",
    );
    thumbnailUrl = thumbResult.secure_url;
    thumbnailPublicId = thumbResult.public_id;
  } else if (!req.body.thumbnail) {
    return next(new AppError(400, "Thumbnail image is required"));
  }

  if (req.files && req.files.images && req.files.images.length > 0) {
    const imagesResults = await uploadMultipleToCloudinary(
      req.files.images,
      "bikes/gallery",
    );
    imagesUrls = imagesResults.map((img) => img.secure_url);
    imagesPublicIds = imagesResults.map((img) => img.public_id);
  }

  const bikeData = {
    ...req.body,
    thumbnail: thumbnailUrl || req.body.thumbnail,
    thumbnailPublicId,
    images: imagesUrls,
    imagesPublicIds: imagesPublicIds,
  };

  try {
    const bike = await Bike.create(bikeData);

    await invalidateCache("bikes:*");

    res.status(201).json({
      success: true,
      message: "Bike created successfully",
      data: bike,
    });
  } catch (error) {
    if (thumbnailPublicId) {
      await deleteFromCloudinary(thumbnailPublicId);
    }
    if (imagesPublicIds.length > 0) {
      await deleteMultipleFromCloudinary(imagesPublicIds);
    }
    throw error;
  }
});

// GET ALL BIKES
exports.getBikes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);

  const {
    brand,
    category,
    maxPrice,
    minPrice,
    search,
    isFeatured,
    isSale,
    isNewArrival,
    isTopSelling,
    isHotDeal,
    isPopular,
  } = req.query;

  const sortedQuery = Object.keys(req.query)
    .sort()
    .reduce((acc, key) => {
      acc[key] = req.query[key];
      return acc;
    }, {});

  const cacheKey = `bikes:list:${JSON.stringify(sortedQuery)}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return res.status(200).json({
      success: true,
      cached: true,
      ...JSON.parse(cached),
    });
  }

  const filter = {};

  // Default to active-only for public. Admins can pass isActive=false to see hidden bikes.
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true";
  } else {
    filter.isActive = true;
  }

  if (brand) filter.brand = brand;

  if (category) {
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      filter.category = category;
    } else {
      const foundCategory = await Category.findOne({ slug: category }).lean();
      if (foundCategory) filter.category = foundCategory._id;
    }
  }

  const booleanFlags = {
    isFeatured,
    isSale,
    isNewArrival,
    isTopSelling,
    isHotDeal,
    isPopular,
  };

  Object.entries(booleanFlags).forEach(([key, value]) => {
    if (value !== undefined) {
      filter[key] = value === "true";
    }
  });

  if (search) {
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.name = { $regex: safeSearch, $options: "i" };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined && !isNaN(minPrice)) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  const skip = (page - 1) * limit;

  const [bikes, total] = await Promise.all([
    Bike.find(filter)
      .populate("category", "name slug")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Bike.countDocuments(filter),
  ]);

  const payload = {
    data: bikes,
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

// GET SINGLE BIKE BY SLUG
exports.getBikeBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const cacheKey = `bikes:single:${slug}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return res
      .status(200)
      .json({ success: true, cached: true, data: JSON.parse(cached) });
  }

  const bike = await Bike.findOne({ slug, isActive: true })
    .populate("category", "name slug")
    .lean();

  if (!bike) {
    return next(new AppError(404, "Bike not found"));
  }

  await redis.set(cacheKey, JSON.stringify(bike), "EX", CACHE_TTL);

  res.status(200).json({ success: true, cached: false, data: bike });
});

// UPDATE BIKE
exports.updateBike = asyncHandler(async (req, res, next) => {
  const existingBike = await Bike.findById(req.params.id);

  if (!existingBike) {
    return next(new AppError(404, "Bike not found"));
  }

  const updateData = { ...req.body };

  if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
    const thumbResult = await uploadToCloudinary(
      req.files.thumbnail[0].buffer,
      "bikes/thumbnails",
    );
    updateData.thumbnail = thumbResult.secure_url;
    updateData.thumbnailPublicId = thumbResult.public_id;

    if (existingBike.thumbnailPublicId) {
      await deleteFromCloudinary(existingBike.thumbnailPublicId);
    }
  }

  if (req.files && req.files.images && req.files.images.length > 0) {
    const imagesResults = await uploadMultipleToCloudinary(
      req.files.images,
      "bikes/gallery",
    );
    const newUrls = imagesResults.map((img) => img.secure_url);
    const newPublicIds = imagesResults.map((img) => img.public_id);

    updateData.images = [...(existingBike.images || []), ...newUrls];
    updateData.imagesPublicIds = [
      ...(existingBike.imagesPublicIds || []),
      ...newPublicIds,
    ];
  }

  const updatedBike = await Bike.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  await invalidateCache("bikes:*");

  await redis.del(`bikes:single:${existingBike.slug}`);
  if (updatedBike.slug && updatedBike.slug !== existingBike.slug) {
    await redis.del(`bikes:single:${updatedBike.slug}`);
  }

  res.status(200).json({
    success: true,
    message: "Bike updated successfully",
    data: updatedBike,
  });
});

// DELETE BIKE (SOFT DELETE)
exports.deleteBike = asyncHandler(async (req, res, next) => {
  const bike = await Bike.findById(req.params.id).lean();

  if (!bike) {
    return next(new AppError(404, "Bike not found"));
  }

  await Bike.findByIdAndUpdate(req.params.id, { isActive: false });

  // Note: Cloudinary images are NOT deleted on soft-delete.
  // The bike can still be restored. Images are only cleaned up on a hard delete.

  await invalidateCache("bikes:*");
  await redis.del(`bikes:single:${bike.slug}`);

  res.status(200).json({
    success: true,
    message: "Bike deleted successfully",
    data: bike,
  });
});
