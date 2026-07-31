import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import { Field, Input, Select, TextArea, Checkbox } from "../../components/ui/Field";
import ImageDropzone from "../../components/ui/ImageDropzone";
import GalleryDropzone from "../../components/ui/GalleryDropzone";
import { useCategories } from "../../hooks/useCategories";
import { useCreateBike, useUpdateBike } from "../../hooks/useBikes";
import { BIKE_FLAGS } from "../../constants";

const emptyForm = {
  name: "",
  brand: "",
  category: "",
  price: "",
  offerPrice: "",
  downPayment: "",
  cashbackOffer: "",
  emiPerMonth: "",
  emiDuration: "",
  interestRate: "",
  description: "",
  engineCC: "",
  mileage: "",
  brakeType: "",
  stock: "",
  isSale: false,
  isNewArrival: false,
  isFeatured: false,
  isTopSelling: false,
  isHotDeal: false,
  isPopular: false,
  isActive: true,
};

export default function BikeForm({ bike, onDone }) {
  const isEdit = Boolean(bike);
  const categories = useCategories({ page: 1, limit: 100, isActive: "true" });
  const createBike = useCreateBike();
  const updateBike = useUpdateBike();

  const [values, setValues] = useState(() =>
    isEdit
      ? {
          ...emptyForm,
          ...bike,
          category: bike.category?._id || bike.category || "",
        }
      : emptyForm,
  );
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [error, setError] = useState("");

  const set = (key) => (e) =>
    setValues((v) => ({
      ...v,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isEdit && !thumbnailFile) {
      setError("A thumbnail image is required.");
      return;
    }

    const payload = { ...values, thumbnailFile, galleryFiles };

    try {
      if (isEdit) {
        await updateBike.mutateAsync({ id: bike._id, values: payload });
        toast.success("Bike updated");
      } else {
        await createBike.mutateAsync(payload);
        toast.success("Bike created");
      }
      onDone();
    } catch (err) {
      setError(err.message);
    }
  };

  const saving = createBike.isPending || updateBike.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" required>
          <Input required value={values.name} onChange={set("name")} />
        </Field>
        <Field label="Brand" required>
          <Input required value={values.brand} onChange={set("brand")} />
        </Field>
        <Field label="Category" required>
          <Select required value={values.category} onChange={set("category")}>
            <option value="" disabled>
              Select a category
            </option>
            {categories.data?.data?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Stock">
          <Input type="number" min="0" value={values.stock} onChange={set("stock")} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Price" required>
          <Input type="number" min="0" step="0.01" required value={values.price} onChange={set("price")} />
        </Field>
        <Field label="Offer price">
          <Input type="number" min="0" step="0.01" value={values.offerPrice} onChange={set("offerPrice")} />
        </Field>
        <Field label="Down payment">
          <Input type="number" min="0" step="0.01" value={values.downPayment} onChange={set("downPayment")} />
        </Field>
        <Field label="Cashback offer">
          <Input type="number" min="0" step="0.01" value={values.cashbackOffer} onChange={set("cashbackOffer")} />
        </Field>
        <Field label="EMI per month">
          <Input type="number" min="0" step="0.01" value={values.emiPerMonth} onChange={set("emiPerMonth")} />
        </Field>
        <Field label="EMI duration">
          <Input placeholder="e.g. 12 months" value={values.emiDuration} onChange={set("emiDuration")} />
        </Field>
        <Field label="Interest rate">
          <Input placeholder="e.g. 0%" value={values.interestRate} onChange={set("interestRate")} />
        </Field>
        <Field label="Engine CC">
          <Input type="number" min="0" value={values.engineCC} onChange={set("engineCC")} />
        </Field>
        <Field label="Mileage">
          <Input placeholder="e.g. 45 km/l" value={values.mileage} onChange={set("mileage")} />
        </Field>
        <Field label="Brake type">
          <Input placeholder="e.g. Disc" value={values.brakeType} onChange={set("brakeType")} />
        </Field>
      </div>

      <Field label="Description" required>
        <TextArea required value={values.description} onChange={set("description")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ImageDropzone
          label="Thumbnail"
          required={!isEdit}
          value={thumbnailFile || bike?.thumbnail}
          onChange={setThumbnailFile}
        />
        <GalleryDropzone
          existing={bike?.images || []}
          files={galleryFiles}
          onFilesChange={setGalleryFiles}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-lg border border-ink-700 p-3 sm:grid-cols-3">
        {BIKE_FLAGS.map(({ key, label }) => (
          <Checkbox
            key={key}
            label={label}
            checked={Boolean(values[key])}
            onChange={set(key)}
          />
        ))}
      </div>

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
          {isEdit ? "Save changes" : "Create bike"}
        </Button>
      </div>
    </form>
  );
}
