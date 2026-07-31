import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Custom dropdown — a styled drop-in replacement for a native <select> when
 * the open list itself needs rounded corners / hover states, which native
 * <option> elements can't take on since the browser renders them natively.
 *
 * options: [{ value, label }]
 */
export default function Dropdown({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex w-full items-center justify-between gap-2 rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-ink-100 hover:bg-ink-700"
      >
        <span className={selected ? "text-ink-100" : "text-ink-500"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1.5 w-full min-w-max overflow-hidden rounded-lg border border-ink-700 bg-ink-900 py-1 shadow-panel"
        >
          {options.map((opt) => (
            <li key={opt.value ?? "__all"}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left text-sm capitalize transition-colors ${
                  opt.value === value
                    ? "bg-ember-500/15 text-ember-300"
                    : "text-ink-200 hover:bg-ink-800"
                }`}
              >
                {opt.label}
                {opt.value === value && <Check size={13} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
