import { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from 'react-router-dom';

// Define the shape of your context
type GameContextType = {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  player: {
    items: Record<string, number>; // Items with numeric values
  };
  setPlayerItems: (update: (prevItems: Record<string, number>) => Record<string, number>) => void;
};

// Create the context with a default value
export const GameContext = createContext<GameContextType>({
  roomId: "1",
  setRoomId: () => {},
  player: {
    items: {},
  },
  setPlayerItems: () => {},
});

// Create a Provider component to wrap your app
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [player, setPlayer] = useState<{ items: Record<string, number> }>({
    items: {}, // Default empty items
  });
  const location = useLocation();

  // Fetch items from the database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://localhost:7058/api/items");
        const data = await response.json();

        const items = data.reduce((acc: Record<string, number>, item: { name: string }) => {
          acc[item.name] = 0; // Default quantity of 0
          return acc;
        }, {});

        setPlayer((prev) => ({
          ...prev,
          items,
        }));
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    fetchItems();
  }, []); // Runs once on mount

  useEffect(() => {
    // Extract roomId from the URL and update the context
    const pathParts = location.pathname.split('/');
    const newRoomId = pathParts[pathParts.length - 1];
    setRoomId(newRoomId);
  }, [location]); // Runs every time the location changes

  // Function to update player's items
  const setPlayerItems = (update: (prevItems: Record<string, number>) => Record<string, number>) => {
    setPlayer((prev) => ({
      ...prev,
      items: update(prev.items),
    }));
  };

  return (
    <GameContext.Provider value={{ roomId, setRoomId, player, setPlayerItems }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for easier context consumption
export const useGameContext = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

export default GameProvider;
