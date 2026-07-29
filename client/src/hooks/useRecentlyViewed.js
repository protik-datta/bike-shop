import { useEffect } from "react";
import { lsGet, lsSet } from "@/utils/localStorage";
import { LS_KEYS, MAX_RECENTLY_VIEWED } from "@/constants/queryKeys";

export function useRecentlyViewed() {
  function getAll() {
    return lsGet(LS_KEYS.RECENTLY_VIEWED, []);
  }

  function addBike(bike) {
    const existing = getAll().filter((b) => b._id !== bike._id);
    const updated  = [bike, ...existing].slice(0, MAX_RECENTLY_VIEWED);
    lsSet(LS_KEYS.RECENTLY_VIEWED, updated);
  }

  function getRecentlyViewed(excludeSlug) {
    return getAll().filter((b) => b.slug !== excludeSlug);
  }

  return { addBike, getRecentlyViewed };
}
