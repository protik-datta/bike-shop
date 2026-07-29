import * as wishlistApi from "@/api/wishlist";

export async function getWishlist() {
  const res = await wishlistApi.fetchWishlist();
  return res.data.data ?? [];
}

export async function addBikeToWishlist(bike) {
  await wishlistApi.addToWishlist(bike);
}

export async function removeBikeFromWishlist(bikeId) {
  await wishlistApi.removeFromWishlist(bikeId);
}

export async function clearWishlist() {
  await wishlistApi.clearWishlist();
}
