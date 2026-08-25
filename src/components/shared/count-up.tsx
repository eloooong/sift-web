"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function CountUp({
  value,
  duration = 0.9,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [animated, setAnimated] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const start =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(Math.round(value * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration, reduceMotion]);

  const display = reduceMotion ? value : animated;

  return (
    <span className={className} aria-hidden="true">
      {display}
    </span>
  );
}

/**
 * Renders the animated number for sighted users plus a visually hidden
 * static value so screen readers announce the final score immediately.
 */
export function AnimatedScore({
  value,
  max = 100,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  return (
    <>
      <span className="sr-only">
        {value} out of {max}
      </span>
      <CountUp value={value} className={className} />
    </>
  );
}
