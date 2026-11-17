import React, { useState } from 'react';
import Header from './components/Header'
import Counter from './components/Counter'
import AutoTimer from './components/AutoTimer';
import './index.css'

export default function App() {
  const [showTimer, setShowTimer] = useState(true);  
  return (
    <div className="App-container">
      <Header
        titre="Mon Super Compteur React"
        sousTitre="Maitrise des Hooks fondamentaux useState et useEffect"
      />
      <Counter/>
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          className="btn btn-reset" onClick={() => setShowTimer(!showTimer)}>
            {showTimer ? 'Masquer le Chronomètre' : 'Afficher le Chronomètre'}
        </button>
      </div>

      {showTimer && <AutoTimer />}
    </div>
  );
}

