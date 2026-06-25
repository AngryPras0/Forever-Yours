import React, { useRef, useEffect } from "react";
import ParticleCanvas from "../components/ParticleCanvas";
import { playSfx } from "../utils/audio";

const LETTER_PARAGRAPHS = [
  "My Love,",
  "Finally...",
  "The moment has arrived.",
  "You have proven yourself worthy of unlocking this little treasure I prepared only for you.",
  "And now, every word you are about to read comes directly from the deepest place inside my heart.",
  "Today marks our 11th month together.",
  "Eleven months of laughter.",
  "Eleven months of memories.",
  "Eleven months of learning, growing, understanding, forgiving, supporting, and loving each other.",
  "Many people say long-distance relationships never last.",
  "Many people believe distance slowly weakens love.",
  "But every day you prove them wrong.",
  "Every call. Every message. Every late-night conversation.",
  "Every difficult moment we overcame together.",
  "Every promise we kept. Every tear we wiped away.",
  "You showed me that real love is not measured in kilometers.",
  "It is measured by commitment. By patience. By loyalty.",
  "By choosing the same person every single day.",
  "And every single day, I choose you.",
  "You are my first love.",
  "And if life is kind to me, you will be my last love too.",
  "I want every future memory to have you in it.",
  "Every dream. Every success. Every adventure.",
  "Every ordinary day that somehow becomes extraordinary because you are there.",
  "The last few months have not always been easy.",
  "Life challenged us. Sometimes circumstances challenged us. Sometimes I challenged us too.",
  "And for every moment I added weight to your shoulders when I should have been offering comfort, I am truly sorry.",
  "I never wanted to become another burden in your life.",
  "I only wanted to help because seeing you struggle hurts my heart more than you know.",
  "You taught me something beautiful.",
  "Love is not always about solving problems.",
  "Sometimes love is simply sitting beside someone and reminding them they are not alone.",
  "So let me remind you once again:",
  "You are not alone.",
  "Not today. Not tomorrow. Not on your hardest days.",
  "Not when life feels unfair. Not when your heart feels heavy.",
  "I will always be standing beside you.",
  "Maybe not physically yet. But always emotionally. Always faithfully. Always completely.",
  "There is something I want you to know.",
  "I have never once wished you were different.",
  "You may not be the most traditionally romantic girl in the world.",
  "But you are my favorite kind of girl.",
  "My favorite smile. My favorite voice. My favorite laugh. My favorite person.",
  "I do not want someone else. I do not want a different version of you.",
  "I simply want you. Exactly as you are.",
  "Because the way you love me is something nobody else could ever replicate.",
  "And I treasure that more than words can explain.",
  "Thank you for every time you forgave me.",
  "Thank you for every time you stayed.",
  "Thank you for every time you believed in us.",
  "Thank you for every time you chose love instead of giving up.",
  "I know we still have things to learn. I know we still have challenges waiting ahead.",
  "But I also know something stronger than every challenge.",
  "Us.",
  "And that gives me hope every single day.",
  "You once gave me the most precious gift anyone could ever receive.",
  "Your heart.",
  "And I promise to protect it with everything I have.",
  "I still smile when I imagine introducing you as my wife one day.",
  "And yes... I can proudly say:",
  "\"You will be my bride,\" and I am still proud of inventing that line. 😅❤️",
  "I talk about you more than you realize.",
  "I talk about our future. Our dreams. Our plans.",
  "The life we hope to build together.",
  "Because when I picture my future, you are already there.",
  "You have become part of every dream I have.",
  "My love, thank you for surviving every difficult moment with me.",
  "Thank you for trusting me. Thank you for choosing me. Thank you for loving me.",
  "And most importantly...",
  "Happy 11th Month Anniversary ❤️",
  "I loved you yesterday. I love you today. And I will love you tomorrow.",
  "No matter how much time passes. No matter how many challenges come our way.",
  "My heart will continue choosing you.",
  "Again. And again. And again.",
  "Forever.",
];

export default function Scene4Letter({ onComplete }) {
  const scrollRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    playSfx("sparkle");
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
          });
        },
        { threshold: 0.18 }
      );
      observerRef.current = obs;
      document.querySelectorAll(".letter-line").forEach((el) => obs.observe(el));
      return () => obs.disconnect();
    }
  }, []);

  return (
    <div className="scene scene4 no-select">
      <div className="moonlit-bg">
        <div className="moon" />
        <div className="moon-glow" />
      </div>
      <ParticleCanvas type="stars" count={150} className="layer" />
      <ParticleCanvas type="petals" count={20} color="#ffb6d5" className="layer" />

      {/* Floating lanterns */}
      <div className="lanterns">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`lantern lantern-${i}`}>
            <div className="lantern-glow" />
            <div className="lantern-body" />
            <div className="lantern-string" />
          </div>
        ))}
      </div>

      <div className="letter-container">
        <div ref={scrollRef} className="letter-paper">
          <h1 className="letter-title">To The Woman Who Changed My Life</h1>
          <div className="letter-divider">✦ ✦ ✦</div>
          {LETTER_PARAGRAPHS.map((p, i) => (
            <p key={i} className="letter-line" style={{ animationDelay: `${i * 0.05}s` }}>
              {p}
            </p>
          ))}
          <div className="letter-signature">
            <div className="sig-divider">~</div>
            <div className="sig-label">Yours,</div>
            <div className="sig-name">Prashant <span className="heart">❤</span></div>
          </div>
          <button data-testid="letter-continue-btn" className="primary-btn ghost" onClick={onComplete}>
            Continue the Magic
          </button>
        </div>
      </div>
    </div>
  );
}
