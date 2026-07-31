import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

const ORDER_KEYS = {
  all: ["orders"],
  list: (params) => ["orders", "list", params],
  detail: (id) => ["orders", "detail", id],
};

export function useOrders(params) {
  return useQuery({
    queryKey: ORDER_KEYS.list(params),
    queryFn: async () => {
      const { data } = await api.get("/orders", { params });
      return data;
    },
    keepPreviousData: true,
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: ORDER_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, orderStatus }) => {
      const { data } = await api.patch(`/orders/${id}/status`, { orderStatus });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all }),
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, paymentStatus }) => {
      const { data } = await api.patch(`/orders/${id}/payment-status`, {
        paymentStatus,
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all }),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/orders/${id}/cancel`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all }),
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/orders/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all }),
  });
}
