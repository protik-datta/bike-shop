import axiosInstance from "./axiosInstance";

export function fetchCategories() {
  return axiosInstance.get("/categories");
}

export function fetchCategoryBySlug(slug) {
  return axiosInstance.get(`/categories/${slug}`);
}
