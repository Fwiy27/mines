import React, { useState } from 'react';
import './Grid.css';

const Grid: React.FC = () => {
  const [clickedCells, setClickedCells] = useState<boolean[][]>(
    Array(5).fill(null).map(() => Array(5).fill(false))
  );

  const handleCellClick = (row: number, col: number) => {
    const newClickedCells = clickedCells.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? !cell : cell))
    );
    setClickedCells(newClickedCells);
  };

  return (
    <div className="grid">
      {clickedCells.map((row, i) => (
        <div key={i} className="row">
          {row.map((clicked, j) => (
            <div
              key={j}
              className={`cell ${clicked ? 'clicked' : ''}`}
              onClick={() => handleCellClick(i, j)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;