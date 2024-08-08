// App.tsx

import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import BettingInterface from './BettingInterface';
import './App.css'
import Grid from './Grid';
import WalletDisplay from './WalletDisplay';
import CashoutPopup from './CashoutPopup';

function calculateMultiplier(mines: number, clicked: number): number {
  if (clicked == 0) {
    return 0
  }
  return Number((0.99 * nCr(25, clicked) / nCr(25 - mines, clicked)).toFixed(2));
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
  const [showCashoutPopup, setShowCashoutPopup] = useState<boolean>(false);
  const [revealedTiles, setRevealedTiles] = useState<boolean[][]>(
    Array(5).fill(null).map(() => Array(5).fill(false))
  );
  const [minePositions, setMinePositions] = useState<number[]>([]);
  const [currentWinnings, setCurrentWinnings] = useState<number>(0);
  const [showAllTiles, setShowAllTiles] = useState<boolean>(false);

  useEffect(() => {
    setCookie('balance', balance.toString(), { path: '/' });
  }, [balance, setCookie]);

  const handleAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const halveBet = () => {
    setAmount(prev => {
      const num = Number(prev) / 2;
      return (num > 0 ? num : 0).toFixed(2);
    });
  };
  
  const doubleBet = () => {
    setAmount(prev => {
      const num = Math.min(Number(prev) * 2, balance);
      return num.toFixed(2);
    });
  }; 

  const handleMinesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMines(Number(e.target.value));
  };

  const play = () => {
    const numAmount = Number(parseFloat(amount).toFixed(2));
    if (numAmount > 0 && numAmount <= balance) {
      setIsPlaying(true);
      setBalance(prevBalance => Number((prevBalance - numAmount).toFixed(2)));
      setMinePositions(generateMinePositions());
      setRevealedTiles(Array(5).fill(null).map(() => Array(5).fill(false)));
      setRevealedCount(0);
      setCurrentWinnings(0);
      setShowAllTiles(false);
      closeCashoutPopup();
    }
  }; 

  const cashout = () => {
    setIsPlaying(false);
    setBalance(prevBalance => Number((prevBalance + currentWinnings).toFixed(2)));
    setShowCashoutPopup(true);
    setShowAllTiles(true);
  };

  const closeCashoutPopup = () => {
    setShowCashoutPopup(false);
    setCurrentWinnings(0);
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
      setCurrentWinnings(Number(calculateWinnings(newRevealedTiles).toFixed(2)));
    }
  }; 

  const calculateWinnings = (revealed: boolean[][]): number => {
    const revealedCount = revealed.flat().filter(Boolean).length;
    const multiplier = calculateMultiplier(mines, revealedCount);
    const winnings = Number(amount) * multiplier;
    return Number(winnings.toFixed(2));
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
        <div className="grid-container">
          <Grid 
            revealedTiles={revealedTiles}
            minePositions={minePositions}
            handleTileClick={handleTileClick}
            isPlaying={isPlaying}
            showAllTiles={showAllTiles}
          />
          {showCashoutPopup && (
            <CashoutPopup
              multiplier={calculateMultiplier(mines, revealedCount)}
              totalWin={currentWinnings}
              onClose={closeCashoutPopup}
            />
          )}
        </div>
      </div>
    </div>
  );
}; 
export default App;