import React, { useState, useEffect } from 'react';

export default function AutoTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let intervalId = null;

    if (isRunning) {
      // 1. Démarrage du timer
      intervalId = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    // 2. FONCTION DE NETTOYAGE OBLIGATOIRE : appelée quand isRunning change ou au démontage
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]); // Se relance uniquement si l'état isRunning change

  return (
    <div className="timer-box">
      <span>
        Chronomètre automatique : <strong>{seconds}s</strong>
      </span>
      <button
        className="btn"
        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? 'Pause' : 'Reprendre'}
      </button>
    </div>
  );
}