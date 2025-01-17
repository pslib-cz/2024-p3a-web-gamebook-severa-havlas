import React, { useState } from "react";

const LightsOutPuzzle: React.FC = () => {
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

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Lights Out Puzzle</h1>
      {isPuzzleSolved && <h2>Congratulations! You solved the puzzle!</h2>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 50px)`,
          gap: "5px",
          justifyContent: "center",
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((isOn, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => toggleLight(rowIndex, colIndex)}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: isOn ? "yellow" : "gray",
                border: "1px solid black",
                cursor: "pointer",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LightsOutPuzzle;
