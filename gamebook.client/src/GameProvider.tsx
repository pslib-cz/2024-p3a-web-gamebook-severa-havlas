import { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

interface PlayerItem {
  itemId: number;
  itemName: string;
  quantity: number;
}

type GameContextType = {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  player: {
    items: PlayerItem[];
  };
  setPlayerItems: (update: (prevItems: PlayerItem[]) => PlayerItem[]) => void;
  serializeContext: () => string; // New method to serialize the context
};

export const GameContext = createContext<GameContextType>({
  roomId: "1",
  setRoomId: () => {},
  player: { items: [] },
  setPlayerItems: () => {},
  serializeContext: () => JSON.stringify({ roomId: "1", player: { items: [] } }), // Default implementation
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [player, setPlayer] = useState<{ items: PlayerItem[] }>({ items: [] });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const newRoomId = pathParts[pathParts.length - 1];
  
    // Only update if the roomId changes
    if (newRoomId !== roomId) {
      setRoomId(newRoomId);
    }
  }, [location.pathname]); // Runs when the URL changes

  const updateRoomId = (id: string | null) => {
    if (id !== roomId) {
      setRoomId(id);
      if (id) {
        navigate(`/Page/${id}`, { replace: true }); // Updates the URL without causing a loop
      }
    }
  };

  const setPlayerItems = (update: (prevItems: PlayerItem[]) => PlayerItem[]) => {
    setPlayer((prev) => ({ ...prev, items: update(prev.items) }));
  };

  const serializeContext = () => {
    return JSON.stringify({
      roomId,
      player,
    });
  };

  return (
    <GameContext.Provider value={{ roomId, setRoomId: updateRoomId, player, setPlayerItems, serializeContext }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

export default GameProvider;
