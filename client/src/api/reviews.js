/**
 * Reviews API — mock only (no server endpoint).
 * Returns a resolved promise to mirror async API patterns.
 * Replace with axiosInstance calls when a review endpoint is added.
 */
import { getReviewsForBike, computeRatingStats } from "@/data/reviews";

export function fetchReviewsBySlug(slug) {
  return Promise.resolve({
    data: {
      success: true,
      data: getReviewsForBike(slug),
    },
  });
}

export function fetchRatingStats(slug) {
  const reviews = getReviewsForBike(slug);
  return Promise.resolve({
    data: {
      success: true,
      data: computeRatingStats(reviews),
    },
  });
}
