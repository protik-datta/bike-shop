import axiosInstance from "./axiosInstance";

export function fetchCategories() {
  return axiosInstance.get("/categories", {params: { page: 1, limit: 20 }});
}

export function fetchCategoryBySlug(slug) {
  return axiosInstance.get(`/categories/${slug}`);
}
