const { z } = require("zod");

const boolString = z
  .union([z.boolean(), z.string()])
  .transform((val) => (typeof val === "string" ? val === "true" : val));

const createBikeSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  brand: z.string().trim().min(1, "Brand is required"),
  category: z.string().trim().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  offerPrice: z.coerce.number().positive().optional(),
  downPayment: z.coerce.number().nonnegative().optional(),
  cashbackOffer: z.coerce.number().nonnegative().optional(),
  emiPerMonth: z.coerce.number().nonnegative().optional(),
  emiDuration: z.string().trim().optional(),
  interestRate: z.string().trim().optional(),

  thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),

  images: z.array(z.string().url()).optional(),
  imagesPublicIds: z.array(z.string()).optional(),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  engineCC: z.coerce.number().positive().optional(),
  mileage: z.string().trim().optional(),
  brakeType: z.string().trim().optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  isSale: boolString.optional(),
  isNewArrival: boolString.optional(),
  isFeatured: boolString.optional(),
  isTopSelling: boolString.optional(),
  isHotDeal: boolString.optional(),
  isPopular: boolString.optional(),
  isActive: boolString.optional(),
});

const updateBikeSchema = createBikeSchema.partial();

const bikeQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(12),
  brand: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  isFeatured: z.enum(["true", "false"]).optional(),
  isSale: z.enum(["true", "false"]).optional(),
  isNewArrival: z.enum(["true", "false"]).optional(),
  isTopSelling: z.enum(["true", "false"]).optional(),
  isHotDeal: z.enum(["true", "false"]).optional(),
  isPopular: z.enum(["true", "false"]).optional(),
  isActive: z.enum(["true", "false"]).optional(),
});

module.exports = { createBikeSchema, updateBikeSchema, bikeQuerySchema };
