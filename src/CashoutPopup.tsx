import React from 'react';
import './CashoutPopup.css';

interface CashoutPopupProps {
  multiplier: number;
  totalWin: number;
  onClose: () => void;
}

const CashoutPopup: React.FC<CashoutPopupProps> = ({ multiplier, totalWin, onClose }) => {
  return (
    <div className="cashout-popup" onDoubleClick={onClose}>
      <p className="multiplier">{multiplier.toFixed(2)}x</p>
      <p className="total-win">${totalWin.toFixed(2)}</p>
    </div>
  );
};

export default CashoutPopup;