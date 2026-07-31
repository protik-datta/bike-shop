export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-700 py-16 text-center">
      {Icon && <Icon size={28} className="text-ink-500" />}
      <div>
        <p className="font-display text-sm font-semibold text-ink-100">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-ink-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
