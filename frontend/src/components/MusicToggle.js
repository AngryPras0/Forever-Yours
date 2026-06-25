import React from "react";

export default function MusicToggle({ on, onClick }) {
  return (
    <button
      data-testid="music-toggle"
      className={`music-toggle ${on ? "on" : ""}`}
      onClick={onClick}
      aria-label="Toggle music"
      title={on ? "Music On" : "Music Off"}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {on ? (
          <>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </>
        ) : (
          <>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line x1="3" y1="3" x2="21" y2="21" stroke="#ff6b9d" strokeWidth="2.5" />
          </>
        )}
      </svg>
    </button>
  );
}
