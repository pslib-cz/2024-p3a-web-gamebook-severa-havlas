import React, { useState } from "react";

interface LockCombinationPuzzleProps {
  numberOfDials: number; // Number of dials on the lock
  maxDialValue: number;  // Maximum value each dial can have (e.g., 9 for a 0-9 lock)
}

const LockCombinationPuzzle: React.FC<LockCombinationPuzzleProps> = ({
  numberOfDials = 4,
  maxDialValue = 9,
}) => {
  // Generate a random combination
  const generateCombination = () =>
    Array.from({ length: numberOfDials }, () =>
      Math.floor(Math.random() * (maxDialValue + 1))
    );

  const [combination] = useState<number[]>(generateCombination());
  const [currentValues, setCurrentValues] = useState<number[]>(
    Array(numberOfDials).fill(0)
  );
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const rotateDial = (index: number, direction: "up" | "down") => {
    setCurrentValues((prevValues) => {
      const newValues = [...prevValues];
      if (direction === "up") {
        newValues[index] = (newValues[index] + 1) % (maxDialValue + 1);
      } else if (direction === "down") {
        newValues[index] =
          (newValues[index] - 1 + (maxDialValue + 1)) % (maxDialValue + 1);
      }
      return newValues;
    });
  };

  const checkCombination = () => {
    if (JSON.stringify(currentValues) === JSON.stringify(combination)) {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {combination}
      <h1>Lock Combination Puzzle</h1>
      {isUnlocked ? (
        <h2 style={{ color: "green" }}>Unlocked! You solved the puzzle!</h2>
      ) : (
        <h2 style={{ color: "red" }}>The lock is still locked.</h2>
      )}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
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
