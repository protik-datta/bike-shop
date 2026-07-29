import axiosInstance from "./axiosInstance";

/**
 * Bike API — mirrors the server /api/v1/bikes endpoints.
 * All functions return the raw Axios response data.
 */

/**
 * @param {Object} params - Query parameters
 * @param {string}  [params.brand]
 * @param {string}  [params.category]      - slug or ObjectId
 * @param {number}  [params.minPrice]
 * @param {number}  [params.maxPrice]
 * @param {string}  [params.search]
 * @param {boolean} [params.isFeatured]
 * @param {boolean} [params.isSale]
 * @param {boolean} [params.isNewArrival]
 * @param {boolean} [params.isTopSelling]
 * @param {boolean} [params.isHotDeal]
 * @param {boolean} [params.isPopular]
 * @param {number}  [params.page]
 * @param {number}  [params.limit]
 */
export function fetchBikes(params = {}) {
  return axiosInstance.get("/bikes", { params });
}

/** @param {string} slug */
export function fetchBikeBySlug(slug) {
  return axiosInstance.get(`/bikes/${slug}`);
}
