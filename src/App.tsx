import React, { useState } from 'react';
import BettingInterface from './BettingInterface';
import './App.css'
import Grid from './Grid';
import WalletDisplay from './WalletDisplay';

const App: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [mines, setMines] = useState<number>(1);
  const [balance, setBalance] = useState<number>(500);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [revealedTiles, setRevealedTiles] = useState<boolean[][]>(
    Array(5).fill(null).map(() => Array(5).fill(false))
  );
  const [minePositions, setMinePositions] = useState<number[]>([]);
  const [currentWinnings, setCurrentWinnings] = useState<number>(0);
  const [showAllTiles, setShowAllTiles] = useState<boolean>(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const halveBet = () => {
    setAmount(prevAmount => Math.max(prevAmount / 2, 0));
  };

  const doubleBet = () => {
    setAmount(prevAmount => Math.min(prevAmount * 2, balance));
  };

  const handleMinesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMines(Number(e.target.value));
  };

  const play = () => {
    if (amount > 0 && amount <= balance) {
      setIsPlaying(true);
      setBalance(prevBalance => prevBalance - amount);
      setMinePositions(generateMinePositions());
      setRevealedTiles(Array(5).fill(null).map(() => Array(5).fill(false)));
      setCurrentWinnings(0);
      setShowAllTiles(false);
    }
  };

  const cashout = () => {
    setIsPlaying(false);
    setBalance(prevBalance => prevBalance + currentWinnings);
    setCurrentWinnings(0);
    setShowAllTiles(true);
  };

  const generateMinePositions = (): number[] => {
    const positions: number[] = [];
    while (positions.length < mines) {
      const position = Math.floor(Math.random() * 25);
      if (!positions.includes(position)) {
        positions.push(position);
      }
    }
    return positions;
  };

  const handleTileClick = (row: number, col: number) => {
    if (!isPlaying) return;

    const index = row * 5 + col;
    if (minePositions.includes(index)) {
      // Game over
      setIsPlaying(false);
      setCurrentWinnings(0);
      setShowAllTiles(true);
    } else {
      const newRevealedTiles = revealedTiles.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? true : cell))
      );
      setRevealedTiles(newRevealedTiles);
      setCurrentWinnings(calculateWinnings(newRevealedTiles));
    }
  };

  const calculateWinnings = (revealed: boolean[][]): number => {
    const revealedCount = revealed.flat().filter(Boolean).length;
    const totalTiles = 25;
    const safetyFactor = 0.97; // Adjust this for house edge
    return amount * Math.pow((totalTiles - mines) / (totalTiles - revealedCount), revealedCount) * safetyFactor;
  };

  return (
    <div className='root'>
      <WalletDisplay balance={balance} currency='$'/>
      <div className="main-content">
        <BettingInterface
          amount={amount}
          handleAmountChange={handleAmountChange}
          halveBet={halveBet}
          doubleBet={doubleBet}
          mines={mines}
          handleMinesChange={handleMinesChange}
          play={isPlaying ? cashout : play}
          isPlaying={isPlaying}
          currentWinnings={currentWinnings}
        />
        <div className="grid">
          <Grid 
            revealedTiles={revealedTiles}
            minePositions={minePositions}
            handleTileClick={handleTileClick}
            isPlaying={isPlaying}
            showAllTiles={showAllTiles}
          />
        </div>
      </div>
    </div>
  );
};

export default App;