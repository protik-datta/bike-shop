import * as reviewsApi from "@/api/reviews";

export async function getReviewsBySlug(slug) {
  const res = await reviewsApi.fetchReviewsBySlug(slug);
  return res.data.data ?? [];
}

export async function getRatingStats(slug) {
  const res = await reviewsApi.fetchRatingStats(slug);
  return res.data.data;
}
