// Keep these in sync with the backend (models/validation) — see server/src.

export const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const PAYMENT_STATUSES = ["pending", "paid", "failed"];

// Mirrors ALLOWED_TRANSITIONS in order.controller.js — the UI should never
// offer a transition the API will reject.
export const ALLOWED_STATUS_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export const ORDER_STATUS_STYLES = {
  pending: "bg-ink-700 text-ink-200 border-ink-600",
  processing: "bg-ember-500/15 text-ember-300 border-ember-500/30",
  shipped: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  delivered: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export const PAYMENT_STATUS_STYLES = {
  pending: "bg-ink-700 text-ink-200 border-ink-600",
  paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  failed: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export const BIKE_FLAGS = [
  { key: "isFeatured", label: "Featured" },
  { key: "isSale", label: "On sale" },
  { key: "isNewArrival", label: "New arrival" },
  { key: "isTopSelling", label: "Top selling" },
  { key: "isHotDeal", label: "Hot deal" },
  { key: "isPopular", label: "Popular" },
  { key: "isActive", label: "Active (visible on site)" },
];
