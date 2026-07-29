import { useState, useEffect } from "react";
import { getCategories, getCategoryBySlug } from "@/services/categoryService";

export function useCategories() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCategories()
      .then((cats) => { if (!cancelled) setData(cats); })
      .catch((err) => { if (!cancelled) setError(err?.message ?? "Failed to load categories."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}

export function useCategoryDetail(slug) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    getCategoryBySlug(slug)
      .then((cat) => { if (!cancelled) setData(cat); })
      .catch((err) => { if (!cancelled) setError(err?.message ?? "Category not found."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  return { data, loading, error };
}
