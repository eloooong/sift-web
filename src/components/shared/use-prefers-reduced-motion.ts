"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion detection.
 *
 * `useSyncExternalStore` renders with the server snapshot (false) during SSR
 * *and* during the hydration pass, then re-renders with the real client value
 * afterwards — so server and client markup always match on first paint.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
