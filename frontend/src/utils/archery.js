import gsap from "gsap";

/**
 * Animate the arrow along a quadratic Bezier curve to ALWAYS hit the bullseye.
 * The control point is placed above the midpoint for a graceful arc.
 */
export function animateArrowToBullseye({ arrow, sceneEl, target, onComplete }) {
  if (!arrow || !target || !sceneEl) return;

  const sceneBox = sceneEl.getBoundingClientRect();
  const arrowBox = arrow.getBoundingClientRect();
  const targetBox = target.getBoundingClientRect();

  const startX = arrowBox.left + arrowBox.width / 2 - sceneBox.left;
  const startY = arrowBox.top + arrowBox.height / 2 - sceneBox.top;
  const endX = targetBox.left + targetBox.width / 2 - sceneBox.left;
  const endY = targetBox.top + targetBox.height / 2 - sceneBox.top;

  arrow.style.position = "absolute";
  arrow.style.left = "0px";
  arrow.style.top = "0px";
  gsap.set(arrow, { x: startX, y: startY, rotation: 0, opacity: 1, transformOrigin: "50% 50%" });

  const ctrlX = (startX + endX) / 2;
  const ctrlY = Math.min(startY, endY) - 180;

  const progress = { t: 0 };
  gsap.to(progress, {
    t: 1,
    duration: 1.1,
    ease: "power2.in",
    onUpdate: () => {
      const u = progress.t;
      const inv = 1 - u;
      const x = inv * inv * startX + 2 * inv * u * ctrlX + u * u * endX;
      const y = inv * inv * startY + 2 * inv * u * ctrlY + u * u * endY;
      const dx = 2 * inv * (ctrlX - startX) + 2 * u * (endX - ctrlX);
      const dy = 2 * inv * (ctrlY - startY) + 2 * u * (endY - ctrlY);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      gsap.set(arrow, { x, y, rotation: angle });
    },
    onComplete,
  });
}
