import { MOCK_CATEGORIES } from "@/data/categories";

const USE_MOCK = false;

export async function getCategories() {
  if (USE_MOCK) return MOCK_CATEGORIES;

  const { fetchCategories } = await import("@/api/categories");
  const res = await fetchCategories();
  return res.data.data ?? [];
}

export async function getCategoryBySlug(slug) {
  if (USE_MOCK) {
    const cat = MOCK_CATEGORIES.find((c) => c.slug === slug);
    if (!cat) throw { message: "Category not found", status: 404 };
    return cat;
  }

  const { fetchCategoryBySlug } = await import("@/api/categories");
  const res = await fetchCategoryBySlug(slug);
  return res.data.data;
}
