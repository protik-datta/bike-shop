const Order = require("../model/order.model");
const Bike = require("../model/bike.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { invalidateCache } = require("../utils/cache");

const restoreStockForOrder = async (order) => {
  if (order.orderItems && order.orderItems.length > 0) {
    const restorePromises = order.orderItems.map((item) =>
      Bike.findByIdAndUpdate(item.bike, { $inc: { stock: item.quantity } }),
    );
    await Promise.all(restorePromises);
    await invalidateCache("bikes:*");
  }
};

// CREATE ORDER
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, ...rest } = req.body;

  const bikeIds = orderItems.map((item) => item.bike);
  const bikes = await Bike.find({ _id: { $in: bikeIds }, isActive: true });

  if (bikes.length !== bikeIds.length) {
    return next(new AppError(404, "One or more bikes could not be found or are inactive"));
  }

  const bikeMap = new Map(bikes.map((b) => [b._id.toString(), b]));

  // Build verified items using server-side price/name/thumbnail (never trust client-supplied values)
  const verifiedItems = orderItems.map((item) => {
    const bike = bikeMap.get(item.bike);
    return {
      bike: bike._id,
      name: bike.name,
      price: bike.price,
      quantity: item.quantity,
      thumbnail: bike.thumbnail,
    };
  });

  // Atomically decrement stock for each item.
  // Using findOneAndUpdate with a stock filter ensures we never oversell —
  // if stock is insufficient the update returns null and we abort.
  const stockErrors = [];
  const successfulDeductions = [];

  for (const item of verifiedItems) {
    const updated = await Bike.findOneAndUpdate(
      { _id: item.bike, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true },
    );

    if (!updated) {
      stockErrors.push(item.name);
    } else {
      successfulDeductions.push({ id: item.bike, quantity: item.quantity });
    }
  }

  // If any item ran out of stock, roll back the deductions already made
  if (stockErrors.length > 0) {
    const rollbackPromises = successfulDeductions.map((d) =>
      Bike.findByIdAndUpdate(d.id, { $inc: { stock: d.quantity } }),
    );
    await Promise.all(rollbackPromises);
    return next(
      new AppError(
        409,
        `Insufficient stock for: ${stockErrors.join(", ")}`,
      ),
    );
  }

  const order = await Order.create({
    ...rest,
    orderItems: verifiedItems,
  });

  // Invalidate bikes cache so product listings show updated stock
  await invalidateCache("bikes:*");

  res.status(201).json({
    success: true,
    data: order,
  });
});

// GET ORDERS WITH PAGINATION AND FILTERING
exports.getOrders = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus, phone, search } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));

  const filter = {};
  if (orderStatus) filter.orderStatus = orderStatus;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (phone) filter.phone = phone;
  if (search) {
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { orderNumber: { $regex: safeSearch, $options: "i" } },
      { firstName: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// GET ORDER BY ID
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError(404, "Order not found"));
  }

  res.status(200).json({ success: true, data: order });
});

// TRACK ORDER
exports.trackOrder = asyncHandler(async (req, res, next) => {
  const { orderNumber } = req.params;
  const { phone } = req.query;

  if (!phone) {
    return next(
      new AppError(400, "Phone number is required to track an order"),
    );
  }

  const order = await Order.findOne({ orderNumber, phone });

  if (!order) {
    return next(new AppError(404, "No matching order found"));
  }

  res.status(200).json({ success: true, data: order });
});

// ORDER STATUS UPDATE LOGIC
const ALLOWED_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError(404, "Order not found"));
  }

  const { orderStatus: nextStatus } = req.body;
  const allowed = ALLOWED_TRANSITIONS[order.orderStatus] || [];

  if (!allowed.includes(nextStatus)) {
    return next(
      new AppError(
        409,
        `Cannot move order from "${order.orderStatus}" to "${nextStatus}"`,
      ),
    );
  }

  order.orderStatus = nextStatus;
  await order.save();

  if (nextStatus === "cancelled") {
    await restoreStockForOrder(order);
  }

  res.status(200).json({ success: true, data: order });
});

// UPDATE PAYMENT STATUS
exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError(404, "Order not found"));
  }

  order.paymentStatus = req.body.paymentStatus;
  await order.save();

  res.status(200).json({ success: true, data: order });
});

// CANCEL ORDER
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError(404, "Order not found"));
  }

  if (!["pending", "processing"].includes(order.orderStatus)) {
    return next(
      new AppError(409, `Cannot cancel order with status "${order.orderStatus}"`),
    );
  }

  order.orderStatus = "cancelled";
  await order.save();

  await restoreStockForOrder(order);

  res.status(200).json({ success: true, data: order });
});

// DELETE ORDERS (hard delete — only for admin cleanup of old/test orders)
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError(404, "Order not found"));
  }

  // Restore stock if the order was NOT already cancelled
  // (cancelled orders already had their stock restored)
  if (order.orderStatus !== "cancelled") {
    await restoreStockForOrder(order);
  }

  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
