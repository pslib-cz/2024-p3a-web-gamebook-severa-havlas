import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGameContext } from "../../GameProvider";

const shuffleArray = (arr: any[]) => arr.sort(() => Math.random() - 0.5);

export default function ShellGame() {
  const { money, setMoney } = useGameContext();
  const [cups, setCups] = useState([0, 1, 2]);
  const [ballPosition, setBallPosition] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCup, setSelectedCup] = useState<number | null>(null);
  const [shuffling, setShuffling] = useState(false);
  const [message, setMessage] = useState("");
  const [bet, setBet] = useState(10);

  const startGame = () => {
    if (money < 10) {
      setMessage("Not enough coins to play! Minimum bet is 10.");
      return;
    }
    if (bet < 10 || bet > money) {
      setMessage("Invalid bet amount! Choose between 10 and your available coins.");
      return;
    }
    setMoney(Math.max(money - bet, 0));
    setBallPosition(Math.floor(Math.random() * 3));
    setGameStarted(true);
    setSelectedCup(null);
    setMessage("");
    shuffleCups();
  };

  const shuffleCups = () => {
    setShuffling(true);
    let newCups = [...cups];
    for (let i = 0; i < 5; i++) {
      newCups = shuffleArray(newCups);
    }
    setTimeout(() => {
      setCups(newCups);
      setShuffling(false);
    }, 2000);
  };

  const selectCup = (index: number) => {
    if (shuffling || !gameStarted) return;
    setSelectedCup(index);
    if (index === ballPosition) {
      setMoney(money + bet * 2);
      setMessage("🎉 Correct! You won " + bet * 2 + " coins!");
    } else {
      setMessage("❌ Wrong! You lost your bet of " + bet + " coins.");
    }
    setGameStarted(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Shell Game</h1>
      <p className="text-lg">Money: {money} coins</p>
      <input
        type="range"
        min="10"
        max={money}
        value={bet}
        onChange={(e) => setBet(Math.max(10, Math.min(Number(e.target.value), money)))}
        className="w-64"
      />
      <p>Bet: {bet} coins</p>
      <div className="flex gap-6">
        {cups.map((cup, index) => (
          <motion.div
            key={index}
            className="w-20 h-32 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer"
            whileTap={{ scale: 0.9 }}
            animate={{ x: shuffling ? [10, -10, 10, 0] : 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => selectCup(index)}
          >
            {gameStarted || selectedCup !== index ? "🥤" : ballPosition === index ? "⚽" : "🥤"}
          </motion.div>
        ))}
      </div>
      <button
        onClick={startGame}
        disabled={shuffling || gameStarted}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {gameStarted ? (shuffling ? "Shuffling..." : "Choose") : "Start Game"}
      </button>
      {message && <p className="text-xl font-bold">{message}</p>}
    </div>
  );
}
