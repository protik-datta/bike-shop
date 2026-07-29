const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: [true, "Order item must reference a bike"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

orderItemSchema.virtual("lineTotal").get(function () {
  return +(this.price * this.quantity).toFixed(2);
});

const ORDER_NUMBER_REGEX = /^[A-Z]{2}\d{6}$/;
const BD_PHONE_REGEX = /^(?:\+?880|0)1[3-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateOrderNumber() {
  const letters = String.fromCharCode(
    65 + Math.floor(Math.random() * 26),
    65 + Math.floor(Math.random() * 26),
  );
  const numbers = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `${letters}${numbers}`;
}

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      default: generateOrderNumber,
      match: [ORDER_NUMBER_REGEX, "Invalid order number format"],
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    streetAddress: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => BD_PHONE_REGEX.test(v),
        message: (props) => `${props.value} is not a valid phone number`,
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => !v || EMAIL_REGEX.test(v),
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "Order must contain at least one item",
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    orderStatus: {
      type: String,
      enum: {
        values: ["pending", "processing", "shipped", "delivered", "cancelled"],
        message: "{VALUE} is not a valid order status",
      },
      default: "pending",
      index: true,
    },
    // Cash on Delivery only — payment is collected by the courier at drop-off.
    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "paid", "failed"],
        message: "{VALUE} is not a valid payment status",
      },
      default: "pending",
      index: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, "Delivery fee cannot be negative"],
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    cancelledAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: cleanTransform },
    toObject: { virtuals: true, transform: cleanTransform },
  },
);

function cleanTransform(_doc, ret) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  return ret;
}

orderSchema.index({ createdAt: -1 });
orderSchema.index({ phone: 1, createdAt: -1 });

orderSchema.pre("validate", async function () {
  if (!this.isNew) return;

  const MAX_ATTEMPTS = 5;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const exists = await this.constructor.exists({
      orderNumber: this.orderNumber,
    });
    if (!exists) return;
    this.orderNumber = generateOrderNumber();
  }

  throw new Error("Failed to generate a unique order number, please retry");
});

orderSchema.pre("validate", function () {
  if (
    this.isModified("orderItems") ||
    this.isModified("deliveryFee") ||
    this.isModified("discountAmount") ||
    this.isNew
  ) {
    const subtotal = this.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    this.subtotal = +subtotal.toFixed(2);
    this.totalAmount = +(
      this.subtotal +
      this.deliveryFee -
      this.discountAmount
    ).toFixed(2);

    if (this.totalAmount < 0) {
      throw new Error("Discount cannot exceed subtotal + delivery fee");
    }
  }
});

orderSchema.pre("save", function () {
  if (this.isModified("orderStatus")) {
    if (this.orderStatus === "cancelled" && !this.cancelledAt) {
      this.cancelledAt = new Date();
    }
    if (this.orderStatus === "delivered" && !this.deliveredAt) {
      this.deliveredAt = new Date();
    }
  }
});

orderSchema.methods.markAsPaid = function () {
  this.paymentStatus = "paid";
  return this.save();
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
