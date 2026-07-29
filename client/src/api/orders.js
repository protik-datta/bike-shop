import axiosInstance from "./axiosInstance";

/**
 * Order API — mirrors the server /api/v1/orders endpoints.
 */

/**
 * Create a new order.
 * @param {Object} payload
 * @param {string}  payload.firstName
 * @param {string}  payload.streetAddress
 * @param {string}  payload.phone
 * @param {string}  [payload.email]
 * @param {string}  [payload.notes]
 * @param {Array}   payload.orderItems  - [{ bike: id, quantity }]
 */
export function createOrder(payload) {
  return axiosInstance.post("/orders", payload);
}

/**
 * @param {Object} params
 * @param {string}  [params.orderStatus]
 * @param {string}  [params.paymentStatus]
 * @param {string}  [params.phone]
 * @param {string}  [params.search]
 * @param {number}  [params.page]
 * @param {number}  [params.limit]
 */
export function fetchOrders(params = {}) {
  return axiosInstance.get("/orders", { params });
}

export function fetchOrderById(id) {
  return axiosInstance.get(`/orders/${id}`);
}

/**
 * @param {string} orderNumber  - e.g. "AB123456"
 * @param {string} phone        - BD phone number
 */
export function trackOrder(orderNumber, phone) {
  return axiosInstance.get(`/orders/track/${orderNumber}`, { params: { phone } });
}

export function cancelOrder(id) {
  return axiosInstance.patch(`/orders/${id}/cancel`);
}
