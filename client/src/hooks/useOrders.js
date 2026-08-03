import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  getOrderById,
  trackOrder,
  cancelOrder,
  placeOrder,
} from "@/services/orderService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export function useOrders() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: getOrders,
  });

  return {
    data: data?.data ?? [],
    pagination: data?.pagination ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useOrderDetail(id) {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.ORDER_DETAIL, id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
}

/** Places an order, then refreshes the local order-history list so the
 * new order shows up on the Orders page without a manual refetch. */
export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });
}

/** Cancels an order, then refreshes both the detail view and the list. */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => cancelOrder(id),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      queryClient.setQueryData(
        [QUERY_KEYS.ORDER_DETAIL, order.id || order._id],
        order,
      );
    },
  });
}

export function useTrackOrder() {
  return useMutation({
    mutationFn: ({ orderNumber, phone }) => trackOrder(orderNumber, phone),
  });
}
