import { create } from "zustand";
import { lsGet, lsSet } from "@/utils/localStorage";
import { LS_KEYS, MAX_COMPARE_ITEMS } from "@/constants/queryKeys";

function load() { return lsGet(LS_KEYS.COMPARE, []); }
function save(items) { lsSet(LS_KEYS.COMPARE, items); }

export const useCompareStore = create((set, get) => ({
  items: load(),

  get isFull() { return get().items.length >= MAX_COMPARE_ITEMS; },
  get isEmpty() { return get().items.length === 0; },
  get totalItems() { return get().items.length; },

  isInCompare(bikeId) {
    return get().items.some((i) => i._id === bikeId);
  },

  addItem(bike) {
    if (get().isInCompare(bike._id)) return { success: false, message: "Already in compare list." };
    if (get().isFull) return { success: false, message: `You can compare up to ${MAX_COMPARE_ITEMS} bikes at a time.` };
    const updated = [...get().items, bike];
    save(updated);
    set({ items: updated });
    return { success: true };
  },

  removeItem(bikeId) {
    const updated = get().items.filter((i) => i._id !== bikeId);
    save(updated);
    set({ items: updated });
  },

  clearCompare() {
    save([]);
    set({ items: [] });
  },
}));
