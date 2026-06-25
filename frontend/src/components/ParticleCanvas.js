import React, { useEffect, useRef } from "react";

/* Generic particle canvas. type: 'hearts' | 'petals' | 'fireflies' | 'sparkles' | 'pollen' | 'stars' */
export default function ParticleCanvas({ type = "sparkles", count = 40, color, className = "" }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * DPR;
      canvas.height = canvas.offsetHeight * DPR;
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const particles = [];
    const rand = (a, b) => a + Math.random() * (b - a);

    const makeParticle = () => {
      const base = {
        x: rand(0, W()),
        y: rand(0, H()),
        vx: rand(-0.4, 0.4),
        vy: rand(-0.6, -0.1),
        size: rand(4, 12),
        opacity: rand(0.4, 1),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.02, 0.02),
        life: rand(0, 1),
      };
      if (type === "fireflies") {
        base.vx = rand(-0.3, 0.3);
        base.vy = rand(-0.3, 0.3);
        base.size = rand(2, 4);
        base.pulse = rand(0, Math.PI * 2);
      }
      if (type === "stars") {
        base.vx = 0; base.vy = rand(0.02, 0.1);
        base.size = rand(0.5, 2);
        base.twinkle = rand(0, Math.PI * 2);
      }
      if (type === "hearts" || type === "petals") {
        base.vy = rand(0.5, 1.5);
        base.vx = rand(-0.8, 0.8);
        base.size = rand(8, 18);
      }
      if (type === "pollen") {
        base.size = rand(1.5, 3.5);
      }
      return base;
    };

    for (let i = 0; i < count; i++) particles.push(makeParticle());

    const drawHeart = (cx, cy, s, c, a, rot) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s / 14, s / 14);
      ctx.globalAlpha = a;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.bezierCurveTo(-12, -5, -12, -18, 0, -10);
      ctx.bezierCurveTo(12, -18, 12, -5, 0, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawPetal = (cx, cy, s, c, a, rot) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      ctx.globalAlpha = a;
      const grad = ctx.createLinearGradient(0, -s, 0, s);
      grad.addColorStop(0, c); grad.addColorStop(1, "#ffd6e8");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.5, s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, W(), H());
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        if (type === "hearts" || type === "petals") {
          p.vx += Math.sin(p.y * 0.01) * 0.02;
          if (p.y > H() + 20) { p.y = -20; p.x = rand(0, W()); }
          if (p.x < -20) p.x = W() + 20;
          if (p.x > W() + 20) p.x = -20;
        }
        if (type === "fireflies") {
          if (p.x < 0 || p.x > W()) p.vx *= -1;
          if (p.y < 0 || p.y > H()) p.vy *= -1;
          p.pulse += 0.04;
        }
        if (type === "stars") {
          if (p.y > H()) p.y = 0;
          p.twinkle += 0.05;
        }
        if (type === "sparkles" || type === "pollen") {
          if (p.y < -20) { p.y = H() + 20; p.x = rand(0, W()); }
          if (p.y > H() + 20) { p.y = -20; p.x = rand(0, W()); }
          if (p.x < -20) p.x = W() + 20;
          if (p.x > W() + 20) p.x = -20;
        }

        const c = color || ({
          hearts: "#ff5a8c",
          petals: "#ffb6d5",
          fireflies: "#fff3a8",
          sparkles: "#fff7d4",
          pollen: "#ffe9a8",
          stars: "#ffffff",
        }[type] || "#fff");

        if (type === "hearts") drawHeart(p.x, p.y, p.size, c, p.opacity, p.rot);
        else if (type === "petals") drawPetal(p.x, p.y, p.size, c, p.opacity, p.rot);
        else if (type === "fireflies") {
          const glow = 0.6 + 0.4 * Math.sin(p.pulse);
          ctx.save(); ctx.globalAlpha = glow * 0.9;
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
          grd.addColorStop(0, c); grd.addColorStop(1, "rgba(255,243,168,0)");
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = glow; ctx.fillStyle = c;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        } else if (type === "stars") {
          const a = 0.4 + 0.6 * Math.abs(Math.sin(p.twinkle));
          ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        } else {
          ctx.save(); ctx.globalAlpha = p.opacity; ctx.fillStyle = c;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      });
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
