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

function calculateNextProfit(currentWinnings: number, initialBet: number, minesCount: number): number {
  const totalTiles = 25;
  const revealedTiles = Math.log(currentWinnings / initialBet) / Math.log((totalTiles - minesCount) / totalTiles);
  const safetyFactor = 0.97;
  return initialBet * Math.pow((totalTiles - minesCount) / (totalTiles - revealedTiles - 1), revealedTiles + 1) * safetyFactor;
}

export default BettingInterface;