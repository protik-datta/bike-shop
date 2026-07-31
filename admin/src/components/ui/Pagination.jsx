import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, total, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-ink-800 px-4 py-3 text-sm text-ink-400">
      <span>
        Page {page} of {totalPages} &middot; {total} total
      </span>
      <div className="flex gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="focus-ring rounded-md border border-ink-700 p-1.5 disabled:opacity-30 hover:bg-ink-800"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="focus-ring rounded-md border border-ink-700 p-1.5 disabled:opacity-30 hover:bg-ink-800"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
