import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ParticleCanvas from "../components/ParticleCanvas";
import { playSfx } from "../utils/audio";

export default function Scene1Archery({ onComplete, musicOn, onRequestMusic }) {
  const [phase, setPhase] = useState("intro"); // intro, aiming, flying, success
  const [showPopup, setShowPopup] = useState(false);
  const arrowRef = useRef(null);
  const targetRef = useRef(null);
  const bowstringRef = useRef(null);
  const sceneRef = useRef(null);

  const [draw, setDraw] = useState(0); // 0..1 how much pulled
  const dragging = useRef(false);
  const startY = useRef(0);

  // Light parallax
  useEffect(() => {
    const onMove = (e) => {
      if (!sceneRef.current) return;
      const t = e.touches ? e.touches[0] : e;
      const x = (t.clientX / window.innerWidth - 0.5) * 14;
      const y = (t.clientY / window.innerHeight - 0.5) * 10;
      sceneRef.current.style.setProperty("--px", `${x}px`);
      sceneRef.current.style.setProperty("--py", `${y}px`);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  const beginGame = () => {
    playSfx("click");
    if (!musicOn) onRequestMusic && onRequestMusic();
    setPhase("aiming");
  };

  const onDragStart = (e) => {
    if (phase !== "aiming") return;
    dragging.current = true;
    const t = e.touches ? e.touches[0] : e;
    startY.current = t.clientY;
  };
  const onDragMove = (e) => {
    if (!dragging.current) return;
    const t = e.touches ? e.touches[0] : e;
    const delta = Math.max(0, Math.min(120, t.clientY - startY.current));
    setDraw(delta / 120);
  };
  const onDragEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (draw > 0.25) fireArrow();
    else setDraw(0);
  };

  const fireArrow = () => {
    setPhase("flying");
    playSfx("arrow");
    const arrow = arrowRef.current;
    const target = targetRef.current;
    if (!arrow || !target) return;
    const sceneBox = sceneRef.current.getBoundingClientRect();
    const arrowBox = arrow.getBoundingClientRect();
    const targetBox = target.getBoundingClientRect();
    const startX = arrowBox.left + arrowBox.width / 2 - sceneBox.left;
    const startYpos = arrowBox.top + arrowBox.height / 2 - sceneBox.top;
    const endX = targetBox.left + targetBox.width / 2 - sceneBox.left;
    const endY = targetBox.top + targetBox.height / 2 - sceneBox.top;

    // Reset draw visually
    setDraw(0);

    // Curved trajectory using GSAP motionPath-like manual quadratic
    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("success");
        playSfx("hit");
        gsap.to(target, { scale: 1.15, duration: 0.3, yoyo: true, repeat: 1 });
        setTimeout(() => setShowPopup(true), 700);
      },
    });

    arrow.style.position = "absolute";
    arrow.style.left = "0px"; arrow.style.top = "0px";
    gsap.set(arrow, { x: startX, y: startYpos, rotation: 0, opacity: 1, transformOrigin: "50% 50%" });

    // Curve: control point above midpoint -> arc
    const ctrlX = (startX + endX) / 2;
    const ctrlY = Math.min(startYpos, endY) - 180;

    const duration = 1.1;
    const obj = { t: 0 };
    tl.to(obj, {
      t: 1,
      duration,
      ease: "power2.in",
      onUpdate: () => {
        const u = obj.t;
        const x = (1 - u) * (1 - u) * startX + 2 * (1 - u) * u * ctrlX + u * u * endX;
        const y = (1 - u) * (1 - u) * startYpos + 2 * (1 - u) * u * ctrlY + u * u * endY;
        // Tangent for rotation
        const dx = 2 * (1 - u) * (ctrlX - startX) + 2 * u * (endX - ctrlX);
        const dy = 2 * (1 - u) * (ctrlY - startYpos) + 2 * u * (endY - ctrlY);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        gsap.set(arrow, { x, y, rotation: angle });
      },
    });
  };

  return (
    <div ref={sceneRef} className="scene scene1 no-select">
      <div className="sky">
        <div className="sun" />
        <div className="sun-rays" />
        <div className="clouds c1" />
        <div className="clouds c2" />
        <div className="clouds c3" />
      </div>
      <div className="hills hills-back" />
      <div className="hills hills-front" />
      <div className="grass-layer" />

      {/* Apple Tree SVG */}
      <div className="apple-tree">
        <svg viewBox="0 0 400 500" width="100%" height="100%">
          <defs>
            <radialGradient id="foliage" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7fc16a" />
              <stop offset="60%" stopColor="#3a8a45" />
              <stop offset="100%" stopColor="#1f5d2a" />
            </radialGradient>
            <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5a3a20" />
              <stop offset="50%" stopColor="#8b5a2b" />
              <stop offset="100%" stopColor="#4a2e18" />
            </linearGradient>
          </defs>
          {/* Trunk */}
          <path d="M180 500 Q175 380 190 280 Q200 220 195 160" stroke="url(#trunk)" strokeWidth="34" fill="none" strokeLinecap="round" />
          {/* Branches */}
          <path d="M195 220 Q140 200 100 170" stroke="url(#trunk)" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M195 240 Q260 230 310 200" stroke="url(#trunk)" strokeWidth="12" fill="none" strokeLinecap="round" />
          {/* Foliage clusters */}
          <ellipse cx="180" cy="140" rx="150" ry="110" fill="url(#foliage)" />
          <ellipse cx="100" cy="160" rx="70" ry="60" fill="url(#foliage)" />
          <ellipse cx="280" cy="170" rx="80" ry="65" fill="url(#foliage)" />
          <ellipse cx="230" cy="100" rx="90" ry="75" fill="url(#foliage)" />
          {/* Apples */}
          {[[130,150],[210,130],[170,200],[260,150],[100,180],[290,210],[200,80]].map(([x,y],i)=> (
            <g key={i}>
              <circle cx={x} cy={y} r="9" fill="#e63946" />
              <circle cx={x-3} cy={y-3} r="2.5" fill="#ff8b94" />
              <path d={`M${x} ${y-9} q-2 -6 4 -8`} stroke="#4a2e18" strokeWidth="1.5" fill="none" />
            </g>
          ))}
          {/* Rope hanging target */}
          <line x1="310" y1="200" x2="310" y2="320" stroke="#6b4226" strokeWidth="3" />
        </svg>
      </div>

      {/* Target */}
      <div ref={targetRef} className={`target ${phase === "success" ? "glow" : ""}`}>
        <svg viewBox="0 0 120 120" width="100%" height="100%">
          <circle cx="60" cy="60" r="58" fill="#fff" stroke="#3a2418" strokeWidth="3" />
          <circle cx="60" cy="60" r="46" fill="#1a73e8" />
          <circle cx="60" cy="60" r="34" fill="#fff" />
          <circle cx="60" cy="60" r="22" fill="#e63946" />
          <circle cx="60" cy="60" r="10" fill="#ffd700" />
          <circle cx="60" cy="60" r="3.5" fill="#3a2418" />
        </svg>
      </div>

      {/* Butterflies */}
      <div className="butterfly b1">🦋</div>
      <div className="butterfly b2">🦋</div>

      {/* Particle layer */}
      <ParticleCanvas type="pollen" count={30} className="layer" />

      {/* Intro overlay */}
      {phase === "intro" && (
        <div className="intro-overlay">
          <div className="intro-card">
            <h1 className="hero-title">Welcome My Love <span className="heart">❤</span></h1>
            <p className="hero-sub">
              Before you unlock what my heart has written for you, there is one little challenge waiting for you.
            </p>
            <button data-testid="begin-btn" className="primary-btn" onClick={beginGame}>
              Let's Begin
            </button>
          </div>
        </div>
      )}

      {/* Bow & Arrow */}
      {(phase === "aiming" || phase === "flying") && (
        <div className="bow-area"
          onMouseDown={onDragStart} onMouseMove={onDragMove} onMouseUp={onDragEnd} onMouseLeave={onDragEnd}
          onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd}>
          <div className="bow-instruction">Drag down on the bow to pull the string, then release ✨</div>
          <svg className="bow" viewBox="0 0 200 260" width="180" height="230">
            <defs>
              <linearGradient id="bowGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4a2e18" />
                <stop offset="50%" stopColor="#a06a3a" />
                <stop offset="100%" stopColor="#4a2e18" />
              </linearGradient>
            </defs>
            <path d="M100 10 Q40 130 100 250" stroke="url(#bowGrad)" strokeWidth="7" fill="none" strokeLinecap="round" />
            {/* String */}
            <path
              ref={bowstringRef}
              d={`M100 10 Q${100 + draw * 90} 130 100 250`}
              stroke="#f4f1ea" strokeWidth="1.6" fill="none"
            />
          </svg>
          {phase === "aiming" && (
            <div ref={arrowRef} className="arrow" style={{ transform: `translateX(${draw * 90}px)` }}>
              <svg viewBox="0 0 120 14" width="100" height="14">
                <line x1="10" y1="7" x2="100" y2="7" stroke="#6b4226" strokeWidth="3" />
                <polygon points="100,2 115,7 100,12" fill="#c0c0c0" stroke="#444" strokeWidth="0.5" />
                <polygon points="10,2 0,7 10,12 6,7" fill="#e63946" />
              </svg>
            </div>
          )}
          {phase === "flying" && (
            <div ref={arrowRef} className="arrow flying">
              <svg viewBox="0 0 120 14" width="100" height="14">
                <line x1="10" y1="7" x2="100" y2="7" stroke="#6b4226" strokeWidth="3" />
                <polygon points="100,2 115,7 100,12" fill="#c0c0c0" />
                <polygon points="10,2 0,7 10,12 6,7" fill="#e63946" />
              </svg>
            </div>
          )}
        </div>
      )}

      {phase === "success" && (
        <>
          <ParticleCanvas type="hearts" count={50} className="layer top" />
          <ParticleCanvas type="petals" count={30} className="layer top" />
          <ParticleCanvas type="sparkles" count={60} className="layer top" />
        </>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card romantic">
            <div className="popup-glow" />
            <h2>That's my girl <span className="heart">❤</span></h2>
            <p>Nothing has ever been impossible for you.</p>
            <p>Every challenge, every obstacle, every difficult day...</p>
            <p>You always find a way through.</p>
            <p>And that is one of the countless reasons why I admire you.</p>
            <p className="italic">Now come with me, my love.</p>
            <p className="italic">The real surprise is waiting.</p>
            <button data-testid="continue-btn" className="primary-btn" onClick={onComplete}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
