import React from 'react';
import './BettingInterface.css'

interface BettingInterfaceProps {
  amount: number;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  halveBet: () => void;
  doubleBet: () => void;
  mines: number;
  handleMinesChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  play: () => void;
  isPlaying: boolean;
  currentWinnings: number;
}

function calculateMultiplier(mines: number, clicked: number): number {
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

function calculateNextProfit(currentWinnings: number, initialBet: number, minesCount: number): number {
  if (currentWinnings <= 0 || initialBet <= 0) return 0;
  const revealedTiles = Math.round(Math.log(currentWinnings / initialBet) / Math.log(calculateMultiplier(minesCount, 1)));
  return initialBet * calculateMultiplier(minesCount, revealedTiles + 1);
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
}) => {
  return (
    <div className="betting-interface">
      <div className="mode-toggle">
        <button className="active">Manual</button>
        <button>Auto</button>
      </div>
      <div className="amount-input">
        <input type="number" value={amount} onChange={handleAmountChange} disabled={isPlaying} />
        <button onClick={halveBet} disabled={isPlaying}>½</button>
        <button onClick={doubleBet} disabled={isPlaying}>2x</button>
      </div>
      <select className="mines-select" value={mines} onChange={handleMinesChange} disabled={isPlaying}>
        {Array.from({length: 24}, (_, i) => i + 1).map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
      <button className={`play-button ${isPlaying ? 'cashout' : ''}`} onClick={play}>
        {isPlaying ? `Cashout $${currentWinnings.toFixed(2)}` : 'Play'}
      </button>
      {isPlaying && (
        <div className="winnings-info">
          <p>Profit on Next Tile: ${(calculateNextProfit(currentWinnings, amount, mines) - currentWinnings).toFixed(2)}</p>
          <p>Total Profit: ${(currentWinnings - amount).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default BettingInterface;