import { create } from "zustand";
import { lsGet, lsSet } from "@/utils/localStorage";
import { LS_KEYS } from "@/constants/queryKeys";

function load() { return lsGet(LS_KEYS.WISHLIST, []); }
function save(items) { lsSet(LS_KEYS.WISHLIST, items); }

export const useWishlistStore = create((set, get) => ({
  items: load(),

  get isEmpty() { return get().items.length === 0; },
  get totalItems() { return get().items.length; },

  isInWishlist(bikeId) {
    return get().items.some((i) => i._id === bikeId);
  },

  toggle(bike) {
    const items = get().items;
    const exists = items.some((i) => i._id === bike._id);
    const updated = exists
      ? items.filter((i) => i._id !== bike._id)
      : [...items, bike];
    save(updated);
    set({ items: updated });
    return !exists; // returns true if added
  },

  addItem(bike) {
    if (get().isInWishlist(bike._id)) return;
    const updated = [...get().items, bike];
    save(updated);
    set({ items: updated });
  },

  removeItem(bikeId) {
    const updated = get().items.filter((i) => i._id !== bikeId);
    save(updated);
    set({ items: updated });
  },

  clearWishlist() {
    save([]);
    set({ items: [] });
  },
}));
