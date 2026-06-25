import React, { useState, useRef } from "react";
import gsap from "gsap";
import ParticleCanvas from "../components/ParticleCanvas";
import { playSfx } from "../utils/audio";

const LID_OPEN_MS = 1400;
const SCROLL_REVEAL_DELAY_MS = 1200;
const TRANSITION_DELAY_MS = 4800;

function ChestSvg({ chestRef, lidRef }) {
  return (
    <div ref={chestRef} className="chest">
      <div className="chest-base">
        <svg viewBox="0 0 220 140" width="100%" height="100%">
          <defs>
            <linearGradient id="goldBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd97a" />
              <stop offset="50%" stopColor="#c98a2a" />
              <stop offset="100%" stopColor="#7c4c12" />
            </linearGradient>
            <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7a4a22" />
              <stop offset="100%" stopColor="#3d2210" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="210" height="130" rx="6" fill="url(#wood)" />
          <rect x="5" y="5" width="210" height="18" fill="url(#goldBase)" />
          <rect x="5" y="115" width="210" height="18" fill="url(#goldBase)" />
          <rect x="100" y="55" width="20" height="40" fill="url(#goldBase)" />
          <circle cx="110" cy="75" r="6" fill="#3d2210" />
        </svg>
      </div>
      <div ref={lidRef} className="chest-lid">
        <svg viewBox="0 0 220 100" width="100%" height="100%">
          <defs>
            <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe49b" />
              <stop offset="100%" stopColor="#a26622" />
            </linearGradient>
          </defs>
          <path d="M5 95 Q110 0 215 95 Z" fill="url(#lidGrad)" stroke="#5e3a14" strokeWidth="2" />
          <path d="M5 95 Q110 10 215 95" fill="none" stroke="#fff5cc" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function ScrollEmerge() {
  return (
    <div className="scroll-emerge">
      <div className="scroll-glow" />
      <svg viewBox="0 0 120 160" width="110" height="150">
        <defs>
          <linearGradient id="parch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff5d6" />
            <stop offset="100%" stopColor="#e6c98a" />
          </linearGradient>
        </defs>
        <rect x="20" y="15" width="80" height="130" rx="4" fill="url(#parch)" stroke="#a07a3a" strokeWidth="1.5" />
        <ellipse cx="60" cy="15" rx="42" ry="7" fill="#c79a4a" />
        <ellipse cx="60" cy="145" rx="42" ry="7" fill="#c79a4a" />
        <circle cx="60" cy="80" r="12" fill="#c1272d" />
        <path d="M55 75 Q60 70 65 75 Q60 80 55 75" fill="#fff5d6" />
      </svg>
    </div>
  );
}

export default function Scene3Treasure({ onComplete }) {
  const [opened, setOpened] = useState(false);
  const [emerging, setEmerging] = useState(false);
  const chestRef = useRef(null);
  const lidRef = useRef(null);

  const openChest = () => {
    if (opened) return;
    setOpened(true);
    playSfx("chest");
    gsap.to(lidRef.current, { rotateX: -110, duration: 1.4, ease: "power3.out" });
    gsap.to(chestRef.current, { y: -10, duration: 0.6, yoyo: true, repeat: 1 });
    setTimeout(() => {
      setEmerging(true);
      playSfx("sparkle");
    }, SCROLL_REVEAL_DELAY_MS);
    setTimeout(() => {
      onComplete();
    }, TRANSITION_DELAY_MS);
    void LID_OPEN_MS;
  };

  return (
    <div className="scene scene3 no-select">
      <div className="magic-garden-bg">
        <div className="mg-blob b1" />
        <div className="mg-blob b2" />
        <div className="mg-light-ray r1" />
        <div className="mg-light-ray r2" />
      </div>
      <ParticleCanvas type="fireflies" count={35} className="layer" />
      <ParticleCanvas type="sparkles" count={50} color="#ffd56b" className="layer" />
      <ParticleCanvas type="pollen" count={30} color="#ffe28a" className="layer" />

      <div className="treasure-container">
        <h2 className="treasure-title">You&apos;ve earned it, my darling <span className="heart">❤</span></h2>

        <div className="chest-stage">
          <div className={`chest-glow ${opened ? "open" : ""}`} />
          <ChestSvg chestRef={chestRef} lidRef={lidRef} />
          {emerging && <ScrollEmerge />}
        </div>

        {!opened && (
          <button data-testid="open-treasure-btn" className="primary-btn gold" onClick={openChest}>
            Open Your Treasure
          </button>
        )}
        {opened && !emerging && <div className="unlock-text">Unlocking...</div>}
        {emerging && <div className="unlock-text">A message emerges...</div>}
      </div>
    </div>
  );
}
