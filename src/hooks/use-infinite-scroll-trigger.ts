import { useEffect, useRef } from "react";

interface UseInfiniteScrollTriggerOptions {
  onIntersect: () => void;
  enabled: boolean;
  rootMargin?: string;
}

/**
 * Returns a ref to attach to a sentinel element at the bottom of a list.
 * Fires onIntersect as soon as the sentinel scrolls into view — the
 * Travelio-style "just keep scrolling" pattern instead of a Load More button.
 */
export function useInfiniteScrollTrigger({
  onIntersect,
  enabled,
  rootMargin = "400px",
}: UseInfiniteScrollTriggerOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersect();
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onIntersect, enabled, rootMargin]);

  return sentinelRef;
}
