import React, { useState } from "react";
import styles from "./LockPuzzle.module.css";

interface LockCombinationPuzzleProps {
  MinigameData: string; // JSON string containing CorrectCombination
  onPuzzleSolved?: () => void; // Callback for when the puzzle is solved
}

const LockCombinationPuzzle: React.FC<LockCombinationPuzzleProps> = ({ MinigameData, onPuzzleSolved }) => {
  // Parse the MinigameData JSON string to extract the correct combination
  let parsedData;
  let correctCombination = "";
  try {
    parsedData = JSON.parse(MinigameData);
    if (parsedData.CorrectCombination) {
      correctCombination = parsedData.CorrectCombination;
    } else {
      throw new Error("CorrectCombination not found in MinigameData");
    }
  } catch (error) {
    console.error("Failed to parse MinigameData or CorrectCombination missing:", error);
    return <div>Error loading puzzle. Please check the MinigameData.</div>;
  }

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
    <div className={styles.container}>
      <h1>Lock Combination Puzzle</h1>
      {isUnlocked ? (
        <h2 className={styles.unlocked}>Unlocked! You solved the puzzle!</h2>
      ) : (
        <h2 className={styles.locked}>The lock is still locked.</h2>
      )}
      <div className={styles.dials}>
        {currentValues.map((value, index) => (
          <div key={index} className={styles.index}>
            <button className={styles.button} onClick={() => rotateDial(index, "up")}>
              ▲
            </button>
            <div className={styles.value}>
              {value}
            </div>
            <button className={styles.button} onClick={() => rotateDial(index, "down")}>
              ▼
            </button>
          </div>
        ))}
      </div>
      <button className={styles.checkButton} onClick={checkCombination}>
        Check Combination
      </button>
    </div>
  );
};

export default LockCombinationPuzzle;
