const { z } = require("zod");

const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  description: z.string().trim().optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  imagePublicId: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

module.exports = { createCategorySchema, updateCategorySchema };
