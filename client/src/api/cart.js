/**
 * Cart API — localStorage-backed, no server required.
 * Returns resolved promises to match the async service contract.
 */
import { lsGet, lsSet } from "@/utils/localStorage";
import { LS_KEYS } from "@/constants/queryKeys";

function readCart() {
  return lsGet(LS_KEYS.CART, []);
}

function writeCart(items) {
  lsSet(LS_KEYS.CART, items);
}

export function fetchCart() {
  return Promise.resolve({ data: { success: true, data: readCart() } });
}

export function addToCart(bike, quantity = 1) {
  const items = readCart();
  const idx = items.findIndex((i) => i._id === bike._id);

  if (idx > -1) {
    items[idx].quantity = Math.min(items[idx].quantity + quantity, bike.stock);
  } else {
    items.push({ ...bike, quantity: Math.min(quantity, bike.stock) });
  }

  writeCart(items);
  return Promise.resolve({ data: { success: true, data: items } });
}

export function updateCartQuantity(bikeId, quantity) {
  const items = readCart().map((i) =>
    i._id === bikeId ? { ...i, quantity: Math.max(1, quantity) } : i
  );
  writeCart(items);
  return Promise.resolve({ data: { success: true, data: items } });
}

export function removeFromCart(bikeId) {
  const items = readCart().filter((i) => i._id !== bikeId);
  writeCart(items);
  return Promise.resolve({ data: { success: true, data: items } });
}

export function clearCart() {
  writeCart([]);
  return Promise.resolve({ data: { success: true, data: [] } });
}
