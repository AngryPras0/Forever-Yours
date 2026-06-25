import { useEffect } from "react";

/**
 * Applies a soft mouse/touch parallax to the given element via CSS vars --px/--py.
 * Amounts in pixels; default amplitude (14, 10).
 */
export default function useParallax(targetRef, amplitudeX = 14, amplitudeY = 10) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return undefined;

    const handleMove = (event) => {
      const point = event.touches ? event.touches[0] : event;
      const x = (point.clientX / window.innerWidth - 0.5) * amplitudeX;
      const y = (point.clientY / window.innerHeight - 0.5) * amplitudeY;
      el.style.setProperty("--px", `${x}px`);
      el.style.setProperty("--py", `${y}px`);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [targetRef, amplitudeX, amplitudeY]);
}
