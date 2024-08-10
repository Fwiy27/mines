import React, { useState, useEffect } from "react";
import "./BettingInterface.css";

interface BettingInterfaceProps {
  amount: string;
  handleAmountChange: (amount: string) => void;
  mines: number;
  handleMinesChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  play: () => void;
  isPlaying: boolean;
  currentWinnings: number;
  revealedCount: number;
  canCashout: boolean;
}

function calculateMultiplier(mines: number, clicked: number): number {
  if (clicked == 0) {
    return 0;
  }
  return Number((0.99 * nCr(25, clicked)) / nCr(25 - mines, clicked));
}

function nCr(n: number, r: number): number {
  if (r > n) return 0;
  if (r === 0 || r === n) return 1;
  r = Math.min(r, n - r);
  let numerator = 1;
  let denominator = 1;
  for (let i = 1; i <= r; i++) {
    numerator *= n - i + 1;
    denominator *= i;
  }
  return numerator / denominator;
}

const BettingInterface: React.FC<BettingInterfaceProps> = ({
  amount,
  handleAmountChange,
  mines,
  handleMinesChange,
  play,
  isPlaying,
  currentWinnings,
  revealedCount,
  canCashout,
}) => {
  const [localAmount, setLocalAmount] = useState(amount);

  useEffect(() => {
    setLocalAmount(amount);
  }, [amount]);

  const initialBet = Number(amount) || 0;
  const netGain = currentWinnings - initialBet;
  const currentMultiplier = calculateMultiplier(mines, revealedCount);

  const handleLocalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAmount(e.target.value);
  };

  const handleAmountBlur = () => {
    const formattedAmount = formatAmount(localAmount);
    setLocalAmount(formattedAmount);
    handleAmountChange(formattedAmount);
  };

  const formatAmount = (value: string): string => {
    const cleanedAmount = value.replace(/[^\d.]/g, "");
    const parts = cleanedAmount.split(".");
    const formattedAmount =
      parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "");
    const match = formattedAmount.match(/^-?\d+(?:\.\d{0,2})?/);
    return match ? match[0] : "";
  };

  const handleLocalHalveBet = () => {
    const newAmount = (Number(localAmount) / 2).toFixed(2);
    setLocalAmount(newAmount);
    handleAmountChange(newAmount);
  };

  const handleLocalDoubleBet = () => {
    const newAmount = (Number(localAmount) * 2).toFixed(2);
    setLocalAmount(newAmount);
    handleAmountChange(newAmount);
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
          <button onClick={handleLocalHalveBet} disabled={isPlaying}>
            ½
          </button>
          <button onClick={handleLocalDoubleBet} disabled={isPlaying}>
            2x
          </button>
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="mines-select">Mines</label>
        <select
          id="mines-select"
          className="mines-select"
          value={mines}
          onChange={handleMinesChange}
          disabled={isPlaying}
        >
          {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      {isPlaying && (
        <div className="current-game-info">
          <div className="multiplier">({currentMultiplier.toFixed(2)}x)</div>
          <div className="net-gain">${netGain.toFixed(2)}</div>
        </div>
      )}
      <button
        className={`play-button ${isPlaying ? "cashout" : ""} ${
          isPlaying && !canCashout ? "disabled" : ""
        }`}
        onClick={play}
        disabled={isPlaying && !canCashout}
      >
        {isPlaying ? `Cashout $${currentWinnings.toFixed(2)}` : "Play"}
      </button>
    </div>
  );
};

export default BettingInterface;
