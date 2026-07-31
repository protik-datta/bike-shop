import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategoryBySlug } from "@/services/categoryService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export function useCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
  };
}

export function useCategoryDetail(slug) {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_DETAIL, slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: Boolean(slug),
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
}
