import { useState, useEffect, useCallback } from "react";
import { getOrders, getOrderById, trackOrder, cancelOrder } from "@/services/orderService";

export function useOrders(params = {}) {
  const [data, setData]       = useState([]);
  const [pagination, setPag]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrders(params);
      setData(res.data ?? []);
      setPag(res.pagination ?? null);
    } catch (err) {
      setError(err?.message ?? "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, pagination, loading, error, refetch: fetch };
}

export function useOrderDetail(id) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getOrderById(id)
      .then((order) => { if (!cancelled) setData(order); })
      .catch((err)  => { if (!cancelled) setError(err?.message ?? "Order not found."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  return { data, loading, error };
}
