import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

const BIKE_KEYS = {
  all: ["bikes"],
  list: (params) => ["bikes", "list", params],
  detail: (id) => ["bikes", "detail", id],
};

export function useBikes(params) {
  return useQuery({
    queryKey: BIKE_KEYS.list(params),
    queryFn: async () => {
      const { data } = await api.get("/bikes", { params });
      return data; // { success, data: [...], pagination }
    },
    keepPreviousData: true,
  });
}

function buildBikeFormData(values) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (key === "thumbnailFile" || key === "galleryFiles") return;
    if (value === undefined || value === null || value === "") return;
    formData.append(key, value);
  });

  if (values.thumbnailFile instanceof File) {
    formData.append("thumbnail", values.thumbnailFile);
  }

  (values.galleryFiles || []).forEach((file) => {
    formData.append("images", file);
  });

  return formData;
}

export function useCreateBike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values) => {
      const { data } = await api.post("/bikes", buildBikeFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BIKE_KEYS.all }),
  });
}

export function useUpdateBike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data } = await api.put(`/bikes/${id}`, buildBikeFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BIKE_KEYS.all }),
  });
}

export function useDeleteBike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/bikes/${id}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BIKE_KEYS.all }),
  });
}
