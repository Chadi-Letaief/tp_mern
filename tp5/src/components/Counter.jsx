import React, { useState, useEffect } from 'react';

const MAX_LIMIT = 50;
const MIN_LIMIT = -50;

export default function Counter() {
  // 1. Initialisation de count depuis le localStorage (si existant, sinon 0)
  const [count, setCount] = useState(() => {
    const sauvegarde = localStorage.getItem('mon_compteur_valeur');
    return sauvegarde !== null ? parseInt(sauvegarde, 10) : 0;
  });

  // Initialisation de l'historique depuis le localStorage (si existant, sinon [])
  const [historique, setHistorique] = useState(() => {
    const sauvegarde = localStorage.getItem('mon_compteur_historique');
    try {
      return sauvegarde !== null ? JSON.parse(sauvegarde) : [];
    } catch {
      return [];
    }
  });

  // 2. EFFET A : Synchroniser le titre de l’onglet du navigateur
  useEffect(() => {
    document.title = 'Compteur : ' + count;
  }, [count]);

  // 3. EFFET B : Sauvegarde automatique de la valeur dans le localStorage
  useEffect(() => {
    localStorage.setItem('mon_compteur_valeur', count.toString());
  }, [count]);

  // 4. EFFET C : Sauvegarde automatique de l'historique dans le localStorage
  useEffect(() => {
    localStorage.setItem('mon_compteur_historique', JSON.stringify(historique));
  }, [historique]);

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('Aucun clic pour le moment');
  const [totalClics, setTotalClics] = useState(0);
  const [alerte, setAlerte] = useState('');

  // Gestionnaire d’incrémentation avec vérification du seuil maximal
  const handleIncrement = () => {
    const nouveauCompte = count + step;

    if (nouveauCompte > MAX_LIMIT) {
      setAlerte('Seuil maximal de 50 atteint !');
      return;
    }

    setAlerte('');
    setCount(nouveauCompte);
    setMessage('Ajout de ' + step);
    setTotalClics(totalClics + 1);
    const action = '+' + step;
    setHistorique([...historique, action]);
  };

  // Gestionnaire de décrémentation avec vérification du seuil minimal
  const handleDecrement = () => {
    const nouveauCompte = count - step;

    if (nouveauCompte < MIN_LIMIT) {
      setAlerte('Seuil minimal de -50 atteint !');
      return;
    }

    setAlerte('');
    setCount(nouveauCompte);
    setMessage('Retrait de ' + step);
    setTotalClics(totalClics + 1);
    const action = '-' + step;
    setHistorique([...historique, action]);
  };

  // Gestionnaire de remise à zéro
  const handleReset = () => {
    setCount(0);
    setAlerte('');
    setMessage('Remise à zéro');
    setTotalClics(totalClics + 1);
    setHistorique([]);
  };

  // 5. EFFET D : Contrôle du compteur au clavier avec nettoyage
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleDecrement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Fonction de nettoyage : détache l'écouteur avant chaque mise à jour ou au démontage
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [count, step, totalClics, historique]);

  // Couleur dynamique selon le signe du compteur
  const getStyleClass = () => {
    if (count > 0) return 'counter-display positive';
    if (count < 0) return 'counter-display negative';
    return 'counter-display zero';
  };

  return (
    <div className="counter-card">
      <div className={getStyleClass()}>{count}</div>

      {alerte && (
        <div
          className="alert-message"
          style={{
            color: '#b91c1c',
            backgroundColor: '#fee2e2',
            border: '1px solid #f87171',
            padding: '8px 12px',
            borderRadius: '6px',
            margin: '10px 0',
            fontWeight: 'bold',
          }}
        >
          ⚠️ {alerte}
        </div>
      )}

      <div className="btn-group">
        <button className="btn btn-dec" onClick={handleDecrement}>
          -{step}
        </button>
        <button className="btn btn-reset" onClick={handleReset}>
          Reset
        </button>
        <button className="btn btn-inc" onClick={handleIncrement}>
          +{step}
        </button>
      </div>

      <div className="step-control">
        <label>Pas d'incrémentation : </label>
        <select
          value={step}
          onChange={(e) => {
            setStep(parseInt(e.target.value, 10));
            setAlerte('');
          }}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>

      <div className="history-card">
        <p>
          <strong>Dernière action :</strong> {message}
        </p>
        <p>
          <strong>Total des clics :</strong> {totalClics}
        </p>
        {historique.length > 0 && (
          <p>
            <strong>Historique :</strong> {historique.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}