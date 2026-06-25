import React, { useEffect, useRef } from "react";
import {
  createParticle,
  updateParticle,
  renderParticle,
  getDefaultColor,
} from "../utils/particles";

/* Generic particle canvas. type: 'hearts' | 'petals' | 'fireflies' | 'sparkles' | 'pollen' | 'stars' */
function ParticleCanvas({ type = "sparkles", count = 40, color, className = "" }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * DPR;
      canvas.height = canvas.offsetHeight * DPR;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener("resize", resize);

    const getW = () => canvas.offsetWidth;
    const getH = () => canvas.offsetHeight;

    const particles = Array.from({ length: count }, () =>
      createParticle(type, getW(), getH())
    );

    const resolvedColor = color || getDefaultColor(type);

    const render = () => {
      const w = getW();
      const h = getH();
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        updateParticle(p, type, w, h);
        renderParticle(ctx, p, type, resolvedColor);
      }
      animRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [type, count, color]);

  return <canvas ref={canvasRef} className={`particle-canvas ${className}`} />;
}

export default ParticleCanvas;
