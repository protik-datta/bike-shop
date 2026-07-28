const { z } = require("zod");

const boolString = z
  .union([z.boolean(), z.string()])
  .transform((val) => (typeof val === "string" ? val === "true" : val));

const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .trim()
    .min(2, "Description must be at least 2 characters"),
  image: z.string().url("Image must be a valid URL").optional(),
  imagePublicId: z.string().trim().optional(),
  isActive: boolString.optional(),
});

const updateCategorySchema = createCategorySchema.partial();

module.exports = { createCategorySchema, updateCategorySchema };
