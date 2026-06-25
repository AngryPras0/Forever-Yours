// Modular particle helpers — extracted to keep ParticleCanvas lean and testable.
const rand = (a, b) => a + Math.random() * (b - a);

const COLORS = {
  hearts: "#ff5a8c",
  petals: "#ffb6d5",
  fireflies: "#fff3a8",
  sparkles: "#fff7d4",
  pollen: "#ffe9a8",
  stars: "#ffffff",
};

export function getDefaultColor(type) {
  return COLORS[type] || "#ffffff";
}

export function createParticle(type, width, height) {
  const base = {
    x: rand(0, width),
    y: rand(0, height),
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
  } else if (type === "stars") {
    base.vx = 0;
    base.vy = rand(0.02, 0.1);
    base.size = rand(0.5, 2);
    base.twinkle = rand(0, Math.PI * 2);
  } else if (type === "hearts" || type === "petals") {
    base.vy = rand(0.5, 1.5);
    base.vx = rand(-0.8, 0.8);
    base.size = rand(8, 18);
  } else if (type === "pollen") {
    base.size = rand(1.5, 3.5);
  }
  return base;
}

export function updateParticle(p, type, width, height) {
  p.x += p.vx;
  p.y += p.vy;
  p.rot += p.vr;

  if (type === "hearts" || type === "petals") {
    p.vx += Math.sin(p.y * 0.01) * 0.02;
    if (p.y > height + 20) {
      p.y = -20;
      p.x = rand(0, width);
    }
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
  } else if (type === "fireflies") {
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    p.pulse += 0.04;
  } else if (type === "stars") {
    if (p.y > height) p.y = 0;
    p.twinkle += 0.05;
  } else {
    // sparkles, pollen
    if (p.y < -20) {
      p.y = height + 20;
      p.x = rand(0, width);
    }
    if (p.y > height + 20) {
      p.y = -20;
      p.x = rand(0, width);
    }
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
  }
}

export function drawHeart(ctx, cx, cy, s, color, alpha, rot) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.scale(s / 14, s / 14);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(-12, -5, -12, -18, 0, -10);
  ctx.bezierCurveTo(12, -18, 12, -5, 0, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawPetal(ctx, cx, cy, s, color, alpha, rot) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  const grad = ctx.createLinearGradient(0, -s, 0, s);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "#ffd6e8");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.5, s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawFirefly(ctx, p, color) {
  const glow = 0.6 + 0.4 * Math.sin(p.pulse);
  ctx.save();
  ctx.globalAlpha = glow * 0.9;
  const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
  grd.addColorStop(0, color);
  grd.addColorStop(1, "rgba(255,243,168,0)");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = glow;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawStar(ctx, p, color) {
  const a = 0.4 + 0.6 * Math.abs(Math.sin(p.twinkle));
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawDot(ctx, p, color) {
  ctx.save();
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function renderParticle(ctx, p, type, color) {
  if (type === "hearts") drawHeart(ctx, p.x, p.y, p.size, color, p.opacity, p.rot);
  else if (type === "petals") drawPetal(ctx, p.x, p.y, p.size, color, p.opacity, p.rot);
  else if (type === "fireflies") drawFirefly(ctx, p, color);
  else if (type === "stars") drawStar(ctx, p, color);
  else drawDot(ctx, p, color);
}
