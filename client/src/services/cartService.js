import * as cartApi from "@/api/cart";

export async function getCart() {
  const res = await cartApi.fetchCart();
  return res.data.data ?? [];
}

export async function addBikeToCart(bike, quantity = 1) {
  const res = await cartApi.addToCart(bike, quantity);
  return res.data.data ?? [];
}

export async function updateQuantity(bikeId, quantity) {
  const res = await cartApi.updateCartQuantity(bikeId, quantity);
  return res.data.data ?? [];
}

export async function removeBikeFromCart(bikeId) {
  const res = await cartApi.removeFromCart(bikeId);
  return res.data.data ?? [];
}

export async function clearCart() {
  await cartApi.clearCart();
}
