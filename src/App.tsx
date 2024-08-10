import React, { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import BettingInterface from "./BettingInterface";
import "./App.css";
import Grid from "./Grid";
import WalletDisplay from "./WalletDisplay";
import CashoutPopup from "./CashoutPopup";

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

const App: React.FC = () => {
  const [cookies, setCookie] = useCookies(["balance"]);
  const [amount, setAmount] = useState<string>("");
  const [mines, setMines] = useState<number>(1);
  const [balance, setBalance] = useState<number>(
    cookies.balance ? Number(cookies.balance) : 500
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [winningMultiplier, setWinningMultiplier] = useState<number>(0);
  const [showCashoutPopup, setShowCashoutPopup] = useState<boolean>(false);
  const [revealedTiles, setRevealedTiles] = useState<boolean[][]>(
    Array(5)
      .fill(null)
      .map(() => Array(5).fill(false))
  );
  const [minePositions, setMinePositions] = useState<number[]>([]);
  const [currentWinnings, setCurrentWinnings] = useState<number>(0);
  const [showAllTiles, setShowAllTiles] = useState<boolean>(false);

  useEffect(() => {
    setCookie("balance", balance.toString(), { path: "/" });
  }, [balance, setCookie]);

  const generateMinePositions = useCallback((): number[] => {
    const positions: number[] = [];
    while (positions.length < mines) {
      const position = Math.floor(Math.random() * 25);
      if (!positions.includes(position)) {
        positions.push(position);
      }
    }
    return positions;
  }, [mines]);

  const closeCashoutPopup = useCallback(() => {
    setShowCashoutPopup(false);
    setCurrentWinnings(0);
  }, []);

  const play = useCallback(() => {
    const numAmount = Number(parseFloat(amount).toFixed(2));
    if (numAmount > 0 && numAmount <= balance) {
      setIsPlaying(true);
      setBalance((prevBalance) => Number((prevBalance - numAmount).toFixed(2)));
      setMinePositions(generateMinePositions());
      setRevealedTiles(
        Array(5)
          .fill(null)
          .map(() => Array(5).fill(false))
      );
      setRevealedCount(0);
      setCurrentWinnings(0);
      setShowAllTiles(false);
      closeCashoutPopup();
    }
  }, [amount, balance, generateMinePositions, closeCashoutPopup]);

  const cashout = useCallback(() => {
    if (revealedCount > 0) {
      const currentMultiplier = calculateMultiplier(mines, revealedCount);
      setIsPlaying(false);
      setBalance((prevBalance) =>
        Number((prevBalance + currentWinnings).toFixed(2))
      );
      setWinningMultiplier(currentMultiplier);
      setShowCashoutPopup(true);
      setShowAllTiles(true);
    }
  }, [currentWinnings, revealedCount, mines]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (isPlaying) {
          if (revealedCount > 0) {
            cashout();
          }
        } else {
          play();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, play, cashout, revealedCount]);

  const handleAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleMinesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMines(Number(e.target.value));
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
      const newWinnings = Number(
        calculateWinnings(newRevealedTiles).toFixed(2)
      );
      setCurrentWinnings(newWinnings);

      // Check if all safe tiles have been revealed
      if (newRevealedCount === 25 - mines) {
        cashout();
      }
    }
  };

  const calculateWinnings = useCallback(
    (revealed: boolean[][]): number => {
      const revealedCount = revealed.flat().filter(Boolean).length;
      const multiplier = calculateMultiplier(mines, revealedCount);
      const winnings = Number(amount) * multiplier;
      return Number(winnings.toFixed(2));
    },
    [mines, amount]
  );

  return (
    <div className="root">
      <WalletDisplay balance={balance} currency="$" setBalance={setBalance} />
      <div className="main-content">
        <BettingInterface
          amount={amount}
          handleAmountChange={handleAmountChange}
          mines={mines}
          handleMinesChange={handleMinesChange}
          play={isPlaying ? cashout : play}
          isPlaying={isPlaying}
          currentWinnings={currentWinnings}
          revealedCount={revealedCount}
          canCashout={revealedCount > 0}
        />
        <div className="grid-container">
          <Grid
            revealedTiles={revealedTiles}
            minePositions={minePositions}
            handleTileClick={handleTileClick}
            isPlaying={isPlaying}
            showAllTiles={showAllTiles}
          />
          <CashoutPopup
            currentMultiplier={winningMultiplier}
            totalWin={currentWinnings}
            onClose={closeCashoutPopup}
            isVisible={showCashoutPopup}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
