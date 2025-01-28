import React, { useState } from "react";

interface LockCombinationPuzzleProps {
  MinigameData: string; // JSON string containing CorrectCombination
  onPuzzleSolved?: () => void; // Callback for when the puzzle is solved
}

const LockCombinationPuzzle: React.FC<LockCombinationPuzzleProps> = ({ MinigameData, onPuzzleSolved }) => {
  // Parse the MinigameData JSON string to extract the correct combination
  const parsedData = JSON.parse(MinigameData);
  const correctCombination = parsedData.CorrectCombination;

  // Number of dials is determined by the length of the correct combination
  const numberOfDials = correctCombination.length;

  // Initialize the current values for each dial (all set to 0 initially)
  const [currentValues, setCurrentValues] = useState<number[]>(Array(numberOfDials).fill(0));

  // Track whether the puzzle is unlocked
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Function to rotate a dial up or down
  const rotateDial = (index: number, direction: "up" | "down") => {
    console.log(`Rotating dial ${index} ${direction}`);
    setCurrentValues((prevValues) => {
      const newValues = [...prevValues];
      if (direction === "up") {
        newValues[index] = (newValues[index] + 1) % 10; // Range 0-9
      } else if (direction === "down") {
        newValues[index] = (newValues[index] - 1 + 10) % 10; // Range 0-9
      }
      console.log("Current values:", newValues);
      return newValues;
    });
  };

  // Function to check if the current values match the correct combination
  const checkCombination = () => {
    console.log("Checking combination...");
    if (currentValues.join("") === correctCombination) {
      console.log("Puzzle solved!");
      setIsUnlocked(true);
      if (onPuzzleSolved) {
        console.log("Calling onPuzzleSolved callback...");
        onPuzzleSolved(); // Notify parent
      }
    } else {
      console.log("Incorrect combination:", currentValues.join(""));
      setIsUnlocked(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Lock Combination Puzzle</h1>
      {isUnlocked ? (
        <h2 style={{ color: "green" }}>Unlocked! You solved the puzzle!</h2>
      ) : (
        <h2 style={{ color: "red" }}>The lock is still locked.</h2>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {currentValues.map((value, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <button
              onClick={() => rotateDial(index, "up")}
              style={{
                display: "block",
                marginBottom: "10px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              ▲
            </button>
            <div
              style={{
                width: "50px",
                height: "50px",
                lineHeight: "50px",
                border: "1px solid black",
                fontSize: "20px",
                fontWeight: "bold",
                backgroundColor: "#f0f0f0",
              }}
            >
              {value}
            </div>
            <button
              onClick={() => rotateDial(index, "down")}
              style={{
                display: "block",
                marginTop: "10px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              ▼
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={checkCombination}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Check Combination
      </button>
    </div>
  );
};

export default LockCombinationPuzzle;
