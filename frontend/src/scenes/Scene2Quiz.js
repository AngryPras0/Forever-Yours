import React, { useState, useCallback } from "react";
import ParticleCanvas from "../components/ParticleCanvas";
import { playSfx } from "../utils/audio";

const QUESTIONS = [
  {
    id: "q-months",
    q: "How many beautiful months have we spent together on this crazy little journey of love?",
    options: [
      { id: "m-10", label: "10" },
      { id: "m-11", label: "11" },
      { id: "m-12", label: "12" },
    ],
    correctId: "m-11",
  },
  {
    id: "q-kiss",
    q: "If I could steal one kiss forever, where would I always choose to place it?",
    options: [
      { id: "k-neck", label: "Neck" },
      { id: "k-tummy", label: "Tummy" },
      { id: "k-feet", label: "Feet" },
    ],
    correctId: "k-tummy",
  },
  {
    id: "q-show-love",
    q: "How do I usually show my love when my heart is overflowing because of you?",
    options: [
      { id: "s-words", label: "Through words" },
      { id: "s-kisses", label: "Through kisses" },
      { id: "s-both", label: "Both" },
    ],
    correctId: "s-both",
  },
  {
    id: "q-still-love",
    q: "After everything we have been through together, do I still love you the same way I always have?",
    options: [
      { id: "l-yes", label: "Yes, you do" },
      { id: "l-no", label: "You love me less now" },
    ],
    correctId: "l-yes",
  },
  {
    id: "q-trust",
    q: "Can you place your trust in me today, tomorrow, and every day after that?",
    options: [
      { id: "t-yes", label: "Yes" },
      { id: "t-no", label: "No" },
    ],
    correctId: "t-yes",
  },
];

const PASS_THRESHOLD = 4;
const ANIM_DELAY_MS = 900;
const BURST_PETAL_COUNT = 12;
const BURST_KEYS = Array.from({ length: BURST_PETAL_COUNT }, (_, i) => `burst-${i}`);

function computeScore(answers) {
  return answers.reduce(
    (acc, a, k) => acc + (a === QUESTIONS[k].correctId ? 1 : 0),
    0
  );
}

function ProgressHeader({ idx, total, done }) {
  const progress = ((idx + (done ? 1 : 0)) / total) * 100;
  return (
    <div className="quiz-header">
      <div className="quiz-title">A Little Love Quiz <span className="heart">❤</span></div>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <div className="quiz-step">{Math.min(idx + 1, total)} / {total}</div>
    </div>
  );
}

function QuestionCard({ question, idx, onAnswer }) {
  return (
    <div key={question.id} className="glass-card quiz-card slide-in">
      <div className="quiz-question">{question.q}</div>
      <div className="quiz-options">
        {question.options.map((opt, i) => (
          <button
            key={opt.id}
            data-testid={`quiz-opt-${idx}-${i}`}
            className="option-btn"
            onClick={(event) => onAnswer(opt.id, event)}
          >
            <span className="option-text">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RetryCard({ onRetry }) {
  return (
    <div className="glass-card retry-card slide-in">
      <div className="retry-emoji">😘</div>
      <h2>You almost made it</h2>
      <p>Try once more, my love.</p>
      <button data-testid="retry-btn" className="primary-btn" onClick={onRetry}>Try Again</button>
    </div>
  );
}

function DoneCard({ score, total }) {
  return (
    <div className="glass-card done-card slide-in">
      <div className="big-heart">💗</div>
      <h2>You know me by heart</h2>
      <p>Score: {score} / {total}</p>
      <p className="italic">Magic awaits...</p>
    </div>
  );
}

export default function Scene2Quiz({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [retryMessage, setRetryMessage] = useState(false);
  const [burst, setBurst] = useState(null);

  const handleAnswer = useCallback(
    (optId, event) => {
      if (animating) return;
      setAnimating(true);
      playSfx("heart");
      const rect = event.currentTarget.getBoundingClientRect();
      setBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      const next = [...answers, optId];
      setTimeout(() => {
        setAnswers(next);
        setBurst(null);
        if (idx + 1 >= QUESTIONS.length) {
          const s = computeScore(next);
          setScore(s);
          if (s >= PASS_THRESHOLD) {
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
      }, ANIM_DELAY_MS);
    },
    [animating, answers, idx, onComplete]
  );

  const retry = useCallback(() => {
    playSfx("click");
    setIdx(0);
    setAnswers([]);
    setScore(0);
    setRetryMessage(false);
    setDone(false);
  }, []);

  const currentQuestion = QUESTIONS[idx];

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
        <ProgressHeader idx={idx} total={QUESTIONS.length} done={done} />
        {!retryMessage && !done && (
          <QuestionCard question={currentQuestion} idx={idx} onAnswer={handleAnswer} />
        )}
        {retryMessage && <RetryCard onRetry={retry} />}
        {done && <DoneCard score={score} total={QUESTIONS.length} />}
      </div>

      {burst && (
        <div className="answer-burst" style={{ left: burst.x, top: burst.y }}>
          {BURST_KEYS.map((key, i) => (
            <span key={key} className="burst-heart" style={{ "--angle": `${i * 30}deg` }}>❤</span>
          ))}
        </div>
      )}
    </div>
  );
}
