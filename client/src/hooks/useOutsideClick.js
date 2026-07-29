import { useEffect, useRef } from "react";

/**
 * Fires callback when a click/touch occurs outside the referenced element.
 * @param {Function} callback
 * @returns {React.RefObject}
 */
export function useOutsideClick(callback) {
  const ref = useRef(null);

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        callback(e);
      }
    }

    document.addEventListener("mousedown", handle);
    document.addEventListener("touchstart", handle);

    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("touchstart", handle);
    };
  }, [callback]);

  return ref;
}
