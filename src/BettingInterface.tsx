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
}

const BettingInterface: React.FC<BettingInterfaceProps> = ({
  amount,
  handleAmountChange,
  halveBet,
  doubleBet,
  mines,
  handleMinesChange,
  play,
}) => {
  return (
    <div className="betting-interface">
      <div className="mode-toggle">
        <button className="active">Manual</button>
        <button>Auto</button>
      </div>
      <div className="amount-input">
        <input type="number" value={amount} onChange={handleAmountChange} />
        <button onClick={halveBet}>½</button>
        <button onClick={doubleBet}>2x</button>
      </div>
      <select className="mines-select" value={mines} onChange={handleMinesChange}>
        {/* Options for mines */}
      </select>
      <button className="play-button" onClick={play}>Play</button>
    </div>
  );
};

export default BettingInterface;
