import React, { useState } from 'react';
import './BettingInterface.css'

interface BettingInterfaceProps {
  amount: string;
  handleAmountChange: (amount: string) => void;
  halveBet: () => void;
  doubleBet: () => void;
  mines: number;
  handleMinesChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  play: () => void;
  isPlaying: boolean;
  currentWinnings: number;
  revealedCount: number;
}

function calculateMultiplier(mines: number, clicked: number): number {
  if (clicked == 0) {
    return 0
  }
  return Number((0.99 * nCr(25, clicked) / nCr(25 - mines, clicked)).toFixed(4));
}

function nCr(n: number, r: number): number {
  if (r > n) return 0;
  if (r === 0 || r === n) return 1;
  r = Math.min(r, n - r);
  let numerator = 1;
  let denominator = 1;
  for (let i = 1; i <= r; i++) {
    numerator *= (n - i + 1);
    denominator *= i;
  }
  return numerator / denominator;
}

const BettingInterface: React.FC<BettingInterfaceProps> = ({
  amount,
  handleAmountChange,
  halveBet,
  doubleBet,
  mines,
  handleMinesChange,
  play,
  isPlaying,
  currentWinnings,
  revealedCount,
}) => {
  const [localAmount, setLocalAmount] = useState(amount);

  const initialBet = Number(amount) || 0;
  const netGain = currentWinnings - initialBet;
  const currentMultiplier = calculateMultiplier(mines, revealedCount);

  const handleLocalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAmount(e.target.value);
  };

  const handleAmountBlur = () => {
    // Remove any non-numeric characters except for the decimal point
    const cleanedAmount = localAmount.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanedAmount.split('.');
    let formattedAmount = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
    
    // Limit to two decimal places
    const match = formattedAmount.match(/^-?\d+(?:\.\d{0,2})?/);
    formattedAmount = match ? match[0] : '';

    // Update both local state and parent component
    setLocalAmount(formattedAmount);
    handleAmountChange(formattedAmount);
  };

  return (
    <div className="betting-interface">
      <div className="input-group">
        <label htmlFor="amount-input">Amount</label>
        <div className="amount-input">
          <input
            id="amount-input"
            type="text"
            value={localAmount}
            onChange={handleLocalAmountChange}
            onBlur={handleAmountBlur}
            disabled={isPlaying}
            placeholder="Enter bet amount"
          />
          <button onClick={halveBet} disabled={isPlaying}>½</button>
          <button onClick={doubleBet} disabled={isPlaying}>2x</button>
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="mines-select">Mines</label>
        <select id="mines-select" className="mines-select" value={mines} onChange={handleMinesChange} disabled={isPlaying}>
          {Array.from({length: 24}, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      {isPlaying && (
        <div className="current-game-info">
          <div className="multiplier">({currentMultiplier.toFixed(2)}x)</div>
          <div className="net-gain">${netGain.toFixed(2)}</div>
        </div>
      )}
      <button className={`play-button ${isPlaying ? 'cashout' : ''}`} onClick={play}>
        {isPlaying ? `Cashout $${currentWinnings.toFixed(2)}` : 'Play'}
      </button>
    </div> 
  );
};

export default BettingInterface;