import React from 'react';
import './WalletDisplay.css';

interface WalletDisplayProps {
  balance: number;
  currency: string;
}

const WalletDisplay: React.FC<WalletDisplayProps> = ({ balance, currency }) => {
  return (
    <div className="wallet-display">
      <div className="balance">
        <span className="currency-symbol">{currency}</span>
        <span className="amount">{balance.toFixed(2)}</span>
        <span className="dropdown-icon">▼</span>
      </div>
      <button className="wallet-button">Wallet</button>
    </div>
  );
};

export default WalletDisplay;