import React, { useState } from "react";
import styles from "./LightsOutPuzzle.module.css";

interface LightsOutPuzzleProps {
  onPuzzleSolved?: () => void; // Callback function for when the puzzle is solved
}

const LightsOutPuzzle: React.FC<LightsOutPuzzleProps> = ({ onPuzzleSolved }) => {
  const gridSize = 3; // 3x3 grid
  const [grid, setGrid] = useState<boolean[][]>(
    Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => Math.random() > 0.5)
    )
  );

  const toggleLight = (row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]); // Deep copy of the grid

      // Helper function to toggle a specific light
      const toggle = (r: number, c: number) => {
        if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
          newGrid[r][c] = !newGrid[r][c];
        }
      };

      // Toggle the clicked light and its adjacent lights
      toggle(row, col); // Center
      toggle(row - 1, col); // Top
      toggle(row + 1, col); // Bottom
      toggle(row, col - 1); // Left
      toggle(row, col + 1); // Right

      return newGrid;
    });
  };

  const isPuzzleSolved = grid.every((row) => row.every((light) => !light));

  if (isPuzzleSolved) {
    // Call the onPuzzleSolved callback when the puzzle is solved
    onPuzzleSolved?.();
  }

  return (
    <div className={styles.container}>
      <h1>Lights Out Puzzle</h1>
      {isPuzzleSolved && <h2>Congratulations! You solved the puzzle!</h2>}
      <div className={styles.grid} style={{ "--grid-size": gridSize } as React.CSSProperties}>
        {grid.map((row, rowIndex) =>
          row.map((isOn, colIndex) => (
            <div 
            className={`${styles.cell} ${isOn ? styles.cellOn : ""}`} 
            key={`${rowIndex}-${colIndex}`} 
            onClick={() => toggleLight(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LightsOutPuzzle;
