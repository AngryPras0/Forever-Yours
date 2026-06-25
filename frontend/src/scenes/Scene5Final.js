import React, { useEffect, useState } from "react";
import ParticleCanvas from "../components/ParticleCanvas";
import { playSfx } from "../utils/audio";

const COUNTERS = [
  { value: 11, label: "Months", suffix: "" },
  { value: 335, label: "Days", suffix: "+" },
  { value: 4827, label: "Messages", suffix: "+" },
  { value: 247, label: "Memories", suffix: "+" },
  { value: 1, label: "Love \u221E", suffix: "" },
];

function Counter({ to, suffix, duration = 1800, delay = 0 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now() + delay;
    let raf;
    const tick = (t) => {
      const elapsed = Math.max(0, t - start);
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, delay]);
  return <span>{n.toLocaleString()}{suffix}</span>;
}

export default function Scene5Final() {
  const [hugged, setHugged] = useState(false);

  useEffect(() => {
    playSfx("sparkle");
  }, []);

  const doHug = () => {
    setHugged(true);
    playSfx("hit");
    setInterval(() => playSfx("heart"), 600);
  };

  return (
    <div className="scene scene5 no-select">
      <div className="finale-bg">
        <div className="fb-blob b1" />
        <div className="fb-blob b2" />
        <div className="fb-blob b3" />
      </div>
      <ParticleCanvas type="stars" count={120} className="layer" />
      <ParticleCanvas type="fireflies" count={30} className="layer" />
      <ParticleCanvas type="hearts" count={hugged ? 120 : 20} className="layer" />

      <div className="finale-content">
        <h2 className="finale-pre">Together we are</h2>

        <div className="counters">
          {COUNTERS.map((c, i) => (
            <div key={i} className="counter-tile" style={{ animationDelay: `${i * 0.18}s` }}>
              <div className="counter-value">
                <Counter to={c.value} suffix={c.suffix} delay={i * 220} duration={1600 + i * 200} />
              </div>
              <div className="counter-label">{c.label}</div>
            </div>
          ))}
        </div>

        <h1 className="finale-title">
          Us Together Till Now <br/> and Forever <span className="heart">❤</span>
        </h1>

        <div className="infinity">
          <svg viewBox="0 0 240 100" width="200" height="90">
            <defs>
              <linearGradient id="infGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff7ab6" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7dd3fc" />
              </linearGradient>
            </defs>
            <path className="infinity-path" d="M60,50 C60,15 105,15 120,50 C135,85 180,85 180,50 C180,15 135,15 120,50 C105,85 60,85 60,50 Z" fill="none" stroke="url(#infGrad)" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>

        {!hugged && (
          <button data-testid="hug-btn" className="primary-btn hug-btn" onClick={doHug}>
            One More Hug 🤗
          </button>
        )}

        {hugged && (
          <div className="hug-message">
            <div className="hug-text">I Love You More Than Words Can Ever Explain <span className="heart">❤</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
