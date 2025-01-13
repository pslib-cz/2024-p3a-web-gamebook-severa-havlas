import { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from 'react-router-dom';

interface PlayerItem {
  itemId: number;
  itemName: string;
  quantity: number;
}

// Define the shape of your context
type GameContextType = {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  player: {
    items: PlayerItem[]; // Array of PlayerItem objects
  };
  setPlayerItems: (update: (prevItems: PlayerItem[]) => PlayerItem[]) => void;
};

// Create the context with a default value
export const GameContext = createContext<GameContextType>({
  roomId: "1",
  setRoomId: () => {},
  player: {
    items: [],
  },
  setPlayerItems: () => {},
});

// Create a Provider component to wrap your app
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [player, setPlayer] = useState<{ items: PlayerItem[] }>({
    items: [], // Default empty array of items
  });
  const location = useLocation();

  // Fetch items from the database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://localhost:7058/api/items");
        const data = await response.json();
    
        const items = data.map((item: { itemId: number; itemName: string }) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: 0, // Default quantity of 0
        }));
    
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
  const setPlayerItems = (update: (prevItems: PlayerItem[]) => PlayerItem[]) => {
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
