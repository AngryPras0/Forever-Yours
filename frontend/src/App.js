import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Scene1Archery from "./scenes/Scene1Archery";
import Scene2Quiz from "./scenes/Scene2Quiz";
import Scene3Treasure from "./scenes/Scene3Treasure";
import Scene4Letter from "./scenes/Scene4Letter";
import Scene5Final from "./scenes/Scene5Final";
import MusicToggle from "./components/MusicToggle";
import { initAudio, playMusic, stopMusic, playSfx } from "./utils/audio";

function App() {
  const [scene, setScene] = useState(1);
  const [musicOn, setMusicOn] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const veilRef = useRef(null);

  useEffect(() => {
    initAudio();
  }, []);

  const toggleMusic = async () => {
    if (!musicOn) {
      await playMusic();
      setMusicOn(true);
    } else {
      stopMusic();
      setMusicOn(false);
    }
  };

  const goToScene = (n) => {
    setTransitioning(true);
    playSfx("whoosh");
    setTimeout(() => {
      setScene(n);
      window.scrollTo(0, 0);
      setTimeout(() => setTransitioning(false), 900);
    }, 800);
  };

  return (
    <div className="app-root">
      <MusicToggle on={musicOn} onClick={toggleMusic} />
      {scene === 1 && <Scene1Archery onComplete={() => goToScene(2)} musicOn={musicOn} onRequestMusic={toggleMusic} />}
      {scene === 2 && <Scene2Quiz onComplete={() => goToScene(3)} />}
      {scene === 3 && <Scene3Treasure onComplete={() => goToScene(4)} />}
      {scene === 4 && <Scene4Letter onComplete={() => goToScene(5)} />}
      {scene === 5 && <Scene5Final />}
      <div ref={veilRef} className={`scene-veil ${transitioning ? "active" : ""}`} />
    </div>
  );
}

export default App;
