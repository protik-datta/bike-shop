import { ImagePlus, X } from "lucide-react";

/**
 * Gallery picker for the bike "images" field.
 * - `existing`: array of URL strings already saved on the bike (read-only —
 *   the API has no endpoint to remove a single gallery image, it only
 *   appends new ones on update).
 * - `files`: array of newly picked Files, added on top of `existing`.
 */
export default function GalleryDropzone({ existing = [], files = [], onFilesChange }) {
  const remaining = Math.max(0, 10 - existing.length - files.length);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-300">
        Gallery images{" "}
        <span className="font-normal text-ink-500">
          (up to 10 total — new images are added to the existing set)
        </span>
      </label>
      <div className="flex flex-wrap gap-2">
        {existing.map((url, i) => (
          <div
            key={`existing-${i}`}
            className="relative h-16 w-16 overflow-hidden rounded-lg border border-ink-700"
          >
            <img src={url} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
        {files.map((file, i) => (
          <FilePreview
            key={`new-${i}`}
            file={file}
            onRemove={() => onFilesChange(files.filter((_, idx) => idx !== i))}
          />
        ))}
        {remaining > 0 && (
          <label className="focus-ring flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-ink-600 bg-ink-800 text-ink-400 hover:bg-ink-700">
            <ImagePlus size={16} />
            <span className="text-[10px]">Add</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                const picked = Array.from(e.target.files || []).slice(0, remaining);
                onFilesChange([...files, ...picked]);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}

function FilePreview({ file, onRemove }) {
  const url = URL.createObjectURL(file);
  return (
    <div className="group relative h-16 w-16 overflow-hidden rounded-lg border border-ember-500/40">
      <img
        src={url}
        alt=""
        className="h-full w-full object-cover"
        onLoad={() => URL.revokeObjectURL(url)}
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute inset-0 flex items-center justify-center bg-ink-950/70 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Remove"
      >
        <X size={16} className="text-ink-100" />
      </button>
    </div>
  );
}
