import React, { useState } from "react";

const ShellGame: React.FC = () => {
  const [ballPosition, setBallPosition] = useState<number>(
    Math.floor(Math.random() * 3)
  );
  const [selectedShell, setSelectedShell] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);

  const shuffleGame = () => {
    setBallPosition(Math.floor(Math.random() * 3));
    setSelectedShell(null);
    setRevealed(false);
  };

  const handleGuess = (index: number) => {
    if (!revealed) {
      setSelectedShell(index);
      setRevealed(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Shell Game</h1>
      <div className="flex gap-4 mb-4">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            className="w-20 h-20 bg-blue-500 text-white text-lg font-bold rounded-lg flex items-center justify-center"
            onClick={() => handleGuess(index)}
            disabled={revealed}
          >
            {revealed && index === ballPosition ? "⚽" : "?"}
          </button>
        ))}
      </div>
      {revealed && (
        <p className="text-lg font-semibold">
          {selectedShell === ballPosition ? "🎉 You guessed right!" : "❌ Try again!"}
        </p>
      )}
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white font-bold rounded-lg"
        onClick={shuffleGame}
      >
        Play Again
      </button>
    </div>
  );
};

export default ShellGame;
