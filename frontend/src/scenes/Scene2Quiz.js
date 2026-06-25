import React, { useState } from "react";
import ParticleCanvas from "../components/ParticleCanvas";
import { playSfx } from "../utils/audio";

const QUESTIONS = [
  {
    q: "How many beautiful months have we spent together on this crazy little journey of love?",
    options: ["10", "11", "12"],
    correct: 1,
  },
  {
    q: "If I could steal one kiss forever, where would I always choose to place it?",
    options: ["Neck", "Tummy", "Feet"],
    correct: 1,
  },
  {
    q: "How do I usually show my love when my heart is overflowing because of you?",
    options: ["Through words", "Through kisses", "Both"],
    correct: 2,
  },
  {
    q: "After everything we have been through together, do I still love you the same way I always have?",
    options: ["Yes, you do", "You love me less now"],
    correct: 0,
  },
  {
    q: "Can you place your trust in me today, tomorrow, and every day after that?",
    options: ["Yes", "No"],
    correct: 0,
  },
];

export default function Scene2Quiz({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [retryMessage, setRetryMessage] = useState(false);
  const [burst, setBurst] = useState(null);

  const handleAnswer = (i, e) => {
    if (animating) return;
    setAnimating(true);
    playSfx("heart");
    const rect = e.currentTarget.getBoundingClientRect();
    setBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    const next = [...answers, i];
    setTimeout(() => {
      setAnswers(next);
      setBurst(null);
      if (idx + 1 >= QUESTIONS.length) {
        const s = next.reduce((acc, a, k) => acc + (a === QUESTIONS[k].correct ? 1 : 0), 0);
        setScore(s);
        if (s >= 4) {
          setDone(true);
          setTimeout(() => onComplete(), 2400);
        } else {
          setRetryMessage(true);
          playSfx("wrong");
        }
      } else {
        setIdx(idx + 1);
      }
      setAnimating(false);
    }, 900);
  };

  const retry = () => {
    playSfx("click");
    setIdx(0); setAnswers([]); setScore(0); setRetryMessage(false); setDone(false);
  };

  const q = QUESTIONS[idx];
  const progress = ((idx + (done ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <div className="scene scene2 no-select">
      <div className="dreamy-bg">
        <div className="dream-blob b1" />
        <div className="dream-blob b2" />
        <div className="dream-blob b3" />
      </div>
      <ParticleCanvas type="stars" count={80} className="layer" />
      <ParticleCanvas type="fireflies" count={25} className="layer" />
      <ParticleCanvas type="hearts" count={15} color="#ff9bc6" className="layer faint" />

      <div className="quiz-wrap">
        <div className="quiz-header">
          <div className="quiz-title">A Little Love Quiz <span className="heart">❤</span></div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <div className="quiz-step">{Math.min(idx + 1, QUESTIONS.length)} / {QUESTIONS.length}</div>
        </div>

        {!retryMessage && !done && (
          <div key={idx} className="glass-card quiz-card slide-in">
            <div className="quiz-question">{q.q}</div>
            <div className="quiz-options">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  data-testid={`quiz-opt-${idx}-${i}`}
                  className="option-btn"
                  onClick={(e) => handleAnswer(i, e)}
                >
                  <span className="option-text">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {retryMessage && (
          <div className="glass-card retry-card slide-in">
            <div className="retry-emoji">😘</div>
            <h2>You almost made it</h2>
            <p>Try once more, my love.</p>
            <button data-testid="retry-btn" className="primary-btn" onClick={retry}>Try Again</button>
          </div>
        )}

        {done && (
          <div className="glass-card done-card slide-in">
            <div className="big-heart">💗</div>
            <h2>You know me by heart</h2>
            <p>Score: {score} / {QUESTIONS.length}</p>
            <p className="italic">Magic awaits...</p>
          </div>
        )}
      </div>

      {burst && (
        <div className="answer-burst" style={{ left: burst.x, top: burst.y }}>
          {[...Array(12)].map((_, i) => (
            <span key={i} className="burst-heart" style={{ "--angle": `${(i * 30)}deg` }}>❤</span>
          ))}
        </div>
      )}
    </div>
  );
}
