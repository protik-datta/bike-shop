import { create } from "zustand";

let toastId = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],

  add({ message, type = "info", duration = 4000 }) {
    const id = ++toastId;
    set({ toasts: [...get().toasts, { id, message, type, duration }] });

    if (duration > 0) {
      setTimeout(() => get().remove(id), duration);
    }

    return id;
  },

  remove(id) {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },

  success(message, duration) { return get().add({ message, type: "success", duration }); },
  error(message, duration)   { return get().add({ message, type: "error",   duration }); },
  warning(message, duration) { return get().add({ message, type: "warning", duration }); },
  info(message, duration)    { return get().add({ message, type: "info",    duration }); },

  clearAll() { set({ toasts: [] }); },
}));
