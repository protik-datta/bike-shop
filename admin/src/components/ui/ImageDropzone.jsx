import { ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Single-image picker with preview. Value is either a File (newly picked)
 * or a string URL (existing image already on the record).
 */
export default function ImageDropzone({ label, value, onChange, required }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(value || null);
  }, [value]);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-300">
        {label} {required && <span className="text-ember-400">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink-700 bg-ink-800">
          {previewUrl ? (
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus size={20} className="text-ink-500" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="focus-ring cursor-pointer rounded-lg border border-ink-600 bg-ink-800 px-3 py-1.5 text-xs font-medium text-ink-200 hover:bg-ink-700">
            {previewUrl ? "Replace image" : "Choose image"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange(file);
                e.target.value = "";
              }}
            />
          </label>
          {previewUrl && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1 text-xs text-ink-400 hover:text-rose-300"
            >
              <X size={12} /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
