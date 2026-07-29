/**
 * Class name utility — merges Tailwind classes without conflicts.
 * Lightweight alternative to clsx + tailwind-merge.
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(" ")
    .trim();
}
