const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");

const orderItemSchema = z.object({
  bike: objectId,
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

const bdPhone = z
  .string()
  .trim()
  .regex(/^(?:\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number");

// Keep this list in sync with the Mongoose Order model's BD_DIVISIONS enum
// and the frontend's DIVISIONS constant.
const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const createOrderSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  division: z.enum(BD_DIVISIONS, {
    required_error: "Division is required",
    invalid_type_error: "Invalid division",
  }),
  district: z.string().trim().min(1, "District is required").max(100),
  streetAddress: z.string().trim().min(1).max(500),
  phone: bdPhone,
  email: z
    .string()
    .trim()
    .lowercase()
    .email()
    .or(z.literal(""))
    .nullable()
    .optional(),
  orderItems: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item"),
  notes: z.string().trim().max(1000).or(z.literal("")).nullable().optional(),
  deliveryFee: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
});

const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(
    ["pending", "processing", "shipped", "delivered", "cancelled"],
    { required_error: "orderStatus is required" },
  ),
});

const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(["pending", "paid", "failed"], {
    required_error: "paymentStatus is required",
  }),
});

const listOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  orderStatus: z
    .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
    .optional(),
  paymentStatus: z.enum(["pending", "paid", "failed"]).optional(),
  phone: z.string().trim().optional(),
  search: z.string().trim().optional(),
  division: z.enum(BD_DIVISIONS).optional(),
  district: z.string().trim().optional(),
});

const orderIdParamSchema = z.object({
  id: objectId,
});

const trackOrderQuerySchema = z.object({
  phone: bdPhone,
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  listOrdersQuerySchema,
  orderIdParamSchema,
  trackOrderQuerySchema,
};
