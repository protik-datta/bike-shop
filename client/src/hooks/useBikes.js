import { useState, useEffect, useCallback } from "react";
import { getBikes, getBikeBySlug } from "@/services/bikeService";

export function useBikes(params = {}) {
  const [data, setData]       = useState([]);
  const [pagination, setPag]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const key = JSON.stringify(params);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBikes(params);
      setData(res.data ?? []);
      setPag(res.pagination ?? null);
    } catch (err) {
      setError(err?.message ?? "Failed to load bikes.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, pagination, loading, error, refetch: fetch };
}

export function useBikeDetail(slug) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    getBikeBySlug(slug)
      .then((bike) => { if (!cancelled) setData(bike); })
      .catch((err) => { if (!cancelled) setError(err?.message ?? "Bike not found."); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [slug]);

  return { data, loading, error };
}
