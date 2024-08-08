import React from 'react';
import './BettingInterface.css'

interface BettingInterfaceProps {
  amount: string;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  const initialBet = Number(amount) || 0;
  const netGain = currentWinnings - initialBet;
  const currentMultiplier = calculateMultiplier(mines, revealedCount);

  return (
    <div className="betting-interface">
      <div className="input-group">
        <label htmlFor="amount-input">Amount</label>
        <div className="amount-input">
          <input
            id="amount-input"
            type="text"
            value={amount}
            onChange={handleAmountChange}
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