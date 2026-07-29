/**
 * Wishlist API — localStorage-backed, no server required.
 * Returns resolved promises to match the async service contract.
 */
import { lsGet, lsSet } from "@/utils/localStorage";
import { LS_KEYS } from "@/constants/queryKeys";

function readWishlist() {
  return lsGet(LS_KEYS.WISHLIST, []);
}

function writeWishlist(items) {
  lsSet(LS_KEYS.WISHLIST, items);
}

export function fetchWishlist() {
  return Promise.resolve({ data: { success: true, data: readWishlist() } });
}

export function addToWishlist(bike) {
  const items = readWishlist();
  const exists = items.some((i) => i._id === bike._id);
  if (!exists) writeWishlist([...items, bike]);
  return Promise.resolve({ data: { success: true } });
}

export function removeFromWishlist(bikeId) {
  const items = readWishlist().filter((i) => i._id !== bikeId);
  writeWishlist(items);
  return Promise.resolve({ data: { success: true } });
}

export function clearWishlist() {
  writeWishlist([]);
  return Promise.resolve({ data: { success: true } });
}
