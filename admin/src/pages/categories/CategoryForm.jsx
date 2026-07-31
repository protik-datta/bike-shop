import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import { Field, Input, TextArea, Checkbox } from "../../components/ui/Field";
import ImageDropzone from "../../components/ui/ImageDropzone";
import { useCreateCategory, useUpdateCategory } from "../../hooks/useCategories";

const emptyForm = { name: "", description: "", isActive: true };

export default function CategoryForm({ category, onDone }) {
  const isEdit = Boolean(category);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [values, setValues] = useState(() =>
    isEdit ? { ...emptyForm, ...category } : emptyForm,
  );
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const set = (key) => (e) =>
    setValues((v) => ({
      ...v,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isEdit && !imageFile) {
      setError("A category image is required.");
      return;
    }

    const payload = { ...values, imageFile };

    try {
      if (isEdit) {
        await updateCategory.mutateAsync({ id: category._id, values: payload });
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync(payload);
        toast.success("Category created");
      }
      onDone();
    } catch (err) {
      setError(err.message);
    }
  };

  const saving = createCategory.isPending || updateCategory.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Name" required>
        <Input required value={values.name} onChange={set("name")} />
      </Field>
      <Field label="Description" required>
        <TextArea required value={values.description} onChange={set("description")} />
      </Field>
      <ImageDropzone
        label="Image"
        required={!isEdit}
        value={imageFile || category?.image}
        onChange={setImageFile}
      />
      <Checkbox
        label="Active (visible on site)"
        checked={Boolean(values.isActive)}
        onChange={set("isActive")}
      />

      {error && (
        <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 border-t border-ink-800 pt-4">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {isEdit ? "Save changes" : "Create category"}
        </Button>
      </div>
    </form>
  );
}
