import { useEffect, useState } from "react";

/**
 * Animated counter from 0 to `to` over `duration` ms, after `delay`.
 * Uses easeOutCubic.
 */
export default function useAnimatedCounter(to, duration = 1800, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const startAt = performance.now() + delay;
    let rafId;

    const tick = (now) => {
      const elapsed = Math.max(0, now - startAt);
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * to));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setValue(to);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [to, duration, delay]);

  return value;
}
