import { useState, useEffect } from "react";

/**
 * Returns true when the given media query matches.
 * @param {string} query - e.g. "(max-width: 768px)"
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function useIsMobile()  { return useMediaQuery("(max-width: 767px)"); }
export function useIsTablet()  { return useMediaQuery("(max-width: 1023px)"); }
export function useIsDesktop() { return useMediaQuery("(min-width: 1024px)"); }
