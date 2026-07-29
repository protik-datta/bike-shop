import { useState, useCallback, useRef } from "react";
import { useToastStore } from "@/store/toastStore";

export function useToast() {
  return useToastStore();
}
