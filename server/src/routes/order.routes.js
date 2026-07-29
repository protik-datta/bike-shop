const express = require("express");
const validate = require("../middlewares/validate.middleware");
const {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  listOrdersQuerySchema,
  orderIdParamSchema,
  trackOrderQuerySchema,
} = require("../validation/order.validation");
const controller = require("../controllers/order.controller");

const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post("/", validate(createOrderSchema, "body"), controller.createOrder);

router.get(
  "/track/:orderNumber",
  validate(trackOrderQuerySchema, "query"),
  controller.trackOrder,
);

router.get("/", validate(listOrdersQuerySchema, "query"), controller.getOrders);

router.get(
  "/:id",
  validate(orderIdParamSchema, "params"),
  controller.getOrderById,
);

router.patch(
  "/:id/status",
  upload.none(),
  [
    validate(orderIdParamSchema, "params"),
    validate(updateOrderStatusSchema, "body"),
  ],
  controller.updateOrderStatus,
);

router.patch(
  "/:id/payment-status",
  upload.none(),
  [
    validate(orderIdParamSchema, "params"),
    validate(updatePaymentStatusSchema, "body"),
  ],
  controller.updatePaymentStatus,
);

router.patch(
  "/:id/cancel",
  upload.none(),
  validate(orderIdParamSchema, "params"),
  controller.cancelOrder,
);

router.delete(
  "/:id",
  validate(orderIdParamSchema, "params"),
  controller.deleteOrder,
);

module.exports = router;
