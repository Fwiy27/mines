// CashoutPopup.tsx

import React, { useState, useEffect } from "react";
import "./CashoutPopup.css";

interface CashoutPopupProps {
  currentMultiplier: number;
  totalWin: number;
  onClose: () => void;
  isVisible: boolean;
}

const CashoutPopup: React.FC<CashoutPopupProps> = ({
  currentMultiplier,
  totalWin,
  onClose,
  isVisible,
}) => {
  const [winningMultiplier, setWinningMultiplier] = useState(currentMultiplier);

  useEffect(() => {
    if (isVisible) {
      setWinningMultiplier(currentMultiplier);
    }
  }, [isVisible, currentMultiplier]);

  if (!isVisible) return null;

  return (
    <div className="cashout-popup" onDoubleClick={onClose}>
      <p className="multiplier">{winningMultiplier.toFixed(2)}x</p>
      <p className="total-win">${totalWin.toFixed(2)}</p>
    </div>
  );
};

export default CashoutPopup;
