import React from 'react';
import './Grid.css';

interface GridProps {
  revealedTiles: boolean[][];
  minePositions: number[];
  handleTileClick: (row: number, col: number) => void;
  isPlaying: boolean;
  showAllTiles: boolean;
}

const Grid: React.FC<GridProps> = ({ revealedTiles, minePositions, handleTileClick, isPlaying, showAllTiles }) => {
  const isMine = (row: number, col: number) => {
    const index = row * 5 + col;
    return minePositions.includes(index);
  };

  return (
    <div className="grid">
      {revealedTiles.map((row, i) => (
        <div key={i} className="row">
          {row.map((revealed, j) => {
            const mine = isMine(i, j);
            let cellClass = 'cell';
            
            if (revealed) {
              cellClass += ' revealed clicked-gem';
            } else if (showAllTiles) {
              cellClass += mine ? ' revealed mine' : ' revealed unclicked-gem';
            }
            
            if (isPlaying) {
              cellClass += ' clickable';
            }
            
            return (
              <div
                key={j}
                className={cellClass}
                onClick={() => isPlaying && handleTileClick(i, j)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;