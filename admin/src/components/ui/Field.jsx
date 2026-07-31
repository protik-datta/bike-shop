const baseInput =
  "focus-ring w-full rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 disabled:opacity-50";

export function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-ink-300">
        {label} {required && <span className="text-ember-400">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

export function Input(props) {
  return <input className={baseInput} {...props} />;
}

export function TextArea(props) {
  return <textarea className={`${baseInput} resize-y`} rows={4} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={baseInput} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-200">
      <input
        type="checkbox"
        className="focus-ring h-4 w-4 rounded border-ink-600 bg-ink-800 text-ember-500"
        {...props}
      />
      {label}
    </label>
  );
}
