import React, { useState } from 'react';
import BettingInterface from './BettingInterface';
import './App.css'
import Grid from './Grid'; // Assuming you have a Grid component
import WalletDisplay from './WalletDisplay';

const MainContent: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [mines, setMines] = useState<number>(0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const halveBet = () => {
    setAmount(prevAmount => prevAmount / 2);
  };

  const doubleBet = () => {
    setAmount(prevAmount => prevAmount * 2);
  };

  const handleMinesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMines(Number(e.target.value));
  };

  const play = () => {
    // Play logic here
  };

  return (
    <div className='root'>
    <WalletDisplay balance={500} currency='$'/>
    <div className="main-content">
      <BettingInterface
        amount={amount}
        handleAmountChange={handleAmountChange}
        halveBet={halveBet}
        doubleBet={doubleBet}
        mines={mines}
        handleMinesChange={handleMinesChange}
        play={play}
      />
      <div className="grid">
        <Grid />
      </div>
    </div>
    </div>
  );
};

export default MainContent;
