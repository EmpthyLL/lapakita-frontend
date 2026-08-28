/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

/**
 * Tracks whether a CSS media query currently matches. Returns false on the
 * server/first render to avoid hydration mismatches, then syncs on mount.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    function handleChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
