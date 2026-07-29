/**
 * Bike Service — business logic layer between the API and UI.
 * Uses mock data in development; swap fetchBikes/fetchBikeBySlug
 * calls here when the backend is live.
 */
import { MOCK_BIKES, filterMockBikes } from "@/data/bikes";
import { PAGE_SIZE } from "@/constants/queryKeys";

const USE_MOCK = true; // ← flip to false when backend is live

export async function getBikes(params = {}) {
  if (USE_MOCK) {
    const {
      page  = 1,
      limit = PAGE_SIZE.SHOP,
      ...filters
    } = params;

    const filtered = filterMockBikes(filters);
    const total = filtered.length;
    const start = (page - 1) * limit;
    const data  = filtered.slice(start, start + limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  const { fetchBikes } = await import("@/api/bikes");
  const res = await fetchBikes(params);
  return res.data;
}

export async function getBikeBySlug(slug) {
  if (USE_MOCK) {
    const bike = MOCK_BIKES.find((b) => b.slug === slug);
    if (!bike) throw { message: "Bike not found", status: 404 };
    return bike;
  }

  const { fetchBikeBySlug } = await import("@/api/bikes");
  const res = await fetchBikeBySlug(slug);
  return res.data.data;
}

export async function getFeaturedBikes(limit = 6) {
  const res = await getBikes({ isFeatured: true, limit });
  return res.data;
}

export async function getNewArrivals(limit = 8) {
  const res = await getBikes({ isNewArrival: true, limit });
  return res.data;
}

export async function getTrendingBikes(limit = 8) {
  const res = await getBikes({ isPopular: true, limit });
  return res.data;
}

export async function getBestSellers(limit = 8) {
  const res = await getBikes({ isTopSelling: true, limit });
  return res.data;
}

export async function getHotDeals(limit = 6) {
  const res = await getBikes({ isHotDeal: true, limit });
  return res.data;
}

export async function getRelatedBikes(currentSlug, category, limit = 4) {
  const res = await getBikes({ category, limit: limit + 1 });
  return (res.data ?? []).filter((b) => b.slug !== currentSlug).slice(0, limit);
}

export async function searchBikes(search, limit = 10) {
  const res = await getBikes({ search, limit });
  return res.data ?? [];
}
