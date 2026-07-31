import { useQuery } from "@tanstack/react-query";
import { getBikes, getBikeBySlug } from "@/services/bikeService";
import {QUERY_KEYS} from "@/constants/queryKeys";

export function useBikes(params = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.BIKES, params],
    queryFn: () => getBikes(params),
  });

  return {
    data: data?.data ?? [],
    pagination: data?.pagination ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useBikeDetail(slug) {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.BIKE_DETAIL, slug],
    queryFn: () => getBikeBySlug(slug),
    enabled: Boolean(slug),
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
}
