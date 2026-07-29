/**
 * Formatting utilities — currency, date, numbers, slugs.
 */

const BDT = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COMPACT = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Format a number as BDT (৳) — e.g. ৳1,25,000 */
export function formatPrice(amount) {
  if (amount == null || isNaN(amount)) return "৳0";
  return BDT.format(amount);
}

/** Compact number — e.g. 12500 → "12.5K" */
export function formatCompact(number) {
  if (number == null || isNaN(number)) return "0";
  return COMPACT.format(number);
}

/** Percentage — e.g. 0.15 → "15%" */
export function formatPercent(value, decimals = 0) {
  if (value == null || isNaN(value)) return "0%";
  return `${(value * 100).toFixed(decimals)}%`;
}

/** Discount percentage between original and offer price */
export function calcDiscount(original, offer) {
  if (!original || !offer || offer >= original) return 0;
  return Math.round(((original - offer) / original) * 100);
}

/** Format a JS Date (or ISO string) to "12 Jan 2025" */
export function formatDate(dateInput) {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Relative time — "2 days ago", "just now" */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const diff = (Date.now() - date.getTime()) / 1000;

  if (diff < 60)     return "just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(date);
}

/** Convert "yamaha-mt-15" → "Yamaha Mt 15" */
export function unslugify(slug = "") {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Truncate text to maxLength chars */
export function truncate(text = "", maxLength = 80) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Pluralise — e.g. pluralise("bike", 1) → "bike", pluralise("bike", 3) → "bikes" */
export function pluralise(word, count, suffix = "s") {
  return count === 1 ? word : `${word}${suffix}`;
}

/** Generate a simple star label — e.g. "4.5 / 5.0" */
export function formatRating(rating) {
  if (rating == null) return "0.0";
  return Number(rating).toFixed(1);
}
