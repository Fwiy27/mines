// WalletDisplay.tsx

import React from 'react';
import './WalletDisplay.css';

interface WalletDisplayProps {
  balance: number;
  currency: string;
  setBalance: (newBalance: number) => void;
}

const WalletDisplay: React.FC<WalletDisplayProps> = ({ balance, currency, setBalance }) => {
  const handleWalletClick = () => {
    const newBalanceString = prompt("Enter new balance:");
    if (newBalanceString !== null) {
      const newBalance = parseFloat(newBalanceString);
      if (!isNaN(newBalance)) {
        setBalance(newBalance);
      } else {
        alert("Invalid input. Please enter a valid number.");
      }
    }
  };

  return (
    <div className="wallet-display">
      <div className="balance">
        <span className="currency-symbol">{currency}</span>
        <span className="amount">{balance.toFixed(2)}</span>
        <span className="dropdown-icon">▼</span>
      </div>
      <button className="wallet-button" onClick={handleWalletClick}>Wallet</button>
    </div>
  );
};

export default WalletDisplay;