import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

const CATEGORY_KEYS = {
  all: ["categories"],
  list: (params) => ["categories", "list", params],
};

export function useCategories(params) {
  return useQuery({
    queryKey: CATEGORY_KEYS.list(params),
    queryFn: async () => {
      const { data } = await api.get("/categories", { params });
      return data;
    },
    keepPreviousData: true,
  });
}

function buildCategoryFormData(values) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (key === "imageFile") return;
    if (value === undefined || value === null || value === "") return;
    formData.append(key, value);
  });
  if (values.imageFile instanceof File) {
    formData.append("image", values.imageFile);
  }
  return formData;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values) => {
      const { data } = await api.post(
        "/categories",
        buildCategoryFormData(values),
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }) => {
      const { data } = await api.patch(
        `/categories/${id}`,
        buildCategoryFormData(values),
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/categories/${id}`);
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all }),
  });
}
