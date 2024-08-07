// App.tsx

import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import BettingInterface from './BettingInterface';
import './App.css'
import Grid from './Grid';
import WalletDisplay from './WalletDisplay';

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

const App: React.FC = () => {
  const [cookies, setCookie] = useCookies(['balance']);
  const [amount, setAmount] = useState<string>(''); 
  const [mines, setMines] = useState<number>(1);
  const [balance, setBalance] = useState<number>(cookies.balance ? Number(cookies.balance) : 500);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [revealedTiles, setRevealedTiles] = useState<boolean[][]>(
    Array(5).fill(null).map(() => Array(5).fill(false))
  );
  const [minePositions, setMinePositions] = useState<number[]>([]);
  const [currentWinnings, setCurrentWinnings] = useState<number>(0);
  const [showAllTiles, setShowAllTiles] = useState<boolean>(false);

  useEffect(() => {
    setCookie('balance', balance.toString(), { path: '/' });
  }, [balance, setCookie]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  }; 

  const halveBet = () => {
    setAmount(prev => {
      const num = Number(prev) / 2;
      return num > 0 ? num.toString() : '0';
    });
  };
  
  const doubleBet = () => {
    setAmount(prev => {
      const num = Math.min(Number(prev) * 2, balance);
      return num.toString();
    });
  }; 

  const handleMinesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMines(Number(e.target.value));
  };

  const play = () => {
    const numAmount = Number(amount);
    if (numAmount > 0 && numAmount <= balance) {
      setIsPlaying(true);
      setBalance(prevBalance => prevBalance - numAmount);
      setMinePositions(generateMinePositions());
      setRevealedTiles(Array(5).fill(null).map(() => Array(5).fill(false)));
      setRevealedCount(0);
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
      const newRevealedCount = newRevealedTiles.flat().filter(Boolean).length;
      setRevealedCount(newRevealedCount);
      setCurrentWinnings(calculateWinnings(newRevealedTiles));
    }
  }; 

  const calculateWinnings = (revealed: boolean[][]): number => {
    const revealedCount = revealed.flat().filter(Boolean).length;
    return Number(amount) * calculateMultiplier(mines, revealedCount);
  }; 

  return (
    <div className='root'>
      <WalletDisplay balance={balance} currency='$' setBalance={setBalance}/>
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
          revealedCount={revealedCount}
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