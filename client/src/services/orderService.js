import * as ordersApi from "@/api/orders";
import { lsGet, lsSet } from "@/utils/localStorage";
import { LS_KEYS } from "@/constants/queryKeys";

const USE_MOCK = false; // flip to false when backend is live

// ── localStorage order store (mock mode) ───────────────────────
function readLocalOrders() {
  return lsGet(LS_KEYS.ORDERS, []);
}

function writeLocalOrders(orders) {
  lsSet(LS_KEYS.ORDERS, orders);
}

// ── Service functions ───────────────────────────────────────────

export async function placeOrder(payload) {
  if (USE_MOCK) {
    const existing = readLocalOrders();
    const newOrder = {
      ...payload,
      id:            `mock-${Date.now()}`,
      orderNumber:   generateOrderNumber(),
      orderStatus:   "pending",
      paymentStatus: "pending",
      deliveryFee:   payload.deliveryFee ?? 500,
      discountAmount:payload.discountAmount ?? 0,
      subtotal:      payload.subtotal,
      totalAmount:   payload.totalAmount,
      createdAt:     new Date().toISOString(),
      updatedAt:     new Date().toISOString(),
    };
    writeLocalOrders([newOrder, ...existing]);
    return newOrder;
  }

  const res = await ordersApi.createOrder(payload);
  // Persist to localStorage for quick access in Orders page
  const order = res.data.data;
  const existing = readLocalOrders();
  writeLocalOrders([order, ...existing]);
  return order;
}

export async function getOrders(params = {}) {
  if (USE_MOCK) {
    return {
      data: readLocalOrders(),
      pagination: { total: readLocalOrders().length, page: 1, limit: 20, totalPages: 1 },
    };
  }

  const res = await ordersApi.fetchOrders(params);
  return res.data;
}

export async function getOrderById(id) {
  if (USE_MOCK) {
    const order = readLocalOrders().find((o) => o.id === id || o._id === id);
    if (!order) throw { message: "Order not found", status: 404 };
    return order;
  }

  const res = await ordersApi.fetchOrderById(id);
  return res.data.data;
}

export async function trackOrder(orderNumber, phone) {
  if (USE_MOCK) {
    const order = readLocalOrders().find((o) => o.orderNumber === orderNumber && o.phone === phone);
    if (!order) throw { message: "No matching order found", status: 404 };
    return order;
  }

  const res = await ordersApi.trackOrder(orderNumber, phone);
  return res.data.data;
}

export async function cancelOrder(id) {
  if (USE_MOCK) {
    const orders = readLocalOrders().map((o) =>
      (o.id === id || o._id === id)
        ? { ...o, orderStatus: "cancelled", cancelledAt: new Date().toISOString() }
        : o
    );
    writeLocalOrders(orders);
    return orders.find((o) => o.id === id || o._id === id);
  }

  const res = await ordersApi.cancelOrder(id);
  return res.data.data;
}

// ── Helpers ────────────────────────────────────────────────────
function generateOrderNumber() {
  const letters = String.fromCharCode(
    65 + Math.floor(Math.random() * 26),
    65 + Math.floor(Math.random() * 26)
  );
  const numbers = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
  return `${letters}${numbers}`;
}

export const ORDER_STATUS_STEPS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

export function getStatusIndex(status) {
  const idx = ORDER_STATUS_STEPS.indexOf(status);
  return status === "cancelled" ? -1 : idx;
}
