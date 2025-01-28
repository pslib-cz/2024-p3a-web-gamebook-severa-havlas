import { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface PlayerItem {
  itemId: number;
  itemName: string;
  quantity: number;
}

type GameContextType = {
  roomId: string | null;
  previousRoomId: string | null; // Added previousRoomId
  setRoomId: (id: string | null) => void;
  player: {
    items: PlayerItem[];
  };
  setPlayerItems: (update: (prevItems: PlayerItem[]) => PlayerItem[]) => void;
  serializeContext: () => string;
};

export const GameContext = createContext<GameContextType>({
  roomId: "1",
  previousRoomId: null, // Default to null
  setRoomId: () => {},
  player: { items: [] },
  setPlayerItems: () => {},
  serializeContext: () =>
    JSON.stringify({ roomId: "1", previousRoomId: null, player: { items: [] } }), // Include previousRoomId
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [roomId, setRoomIdState] = useState<string | null>(null);
  const [previousRoomId, setPreviousRoomId] = useState<string | null>(null); // State for tracking the previous room
  const [player, setPlayer] = useState<{ items: PlayerItem[] }>({ items: [] });
  const location = useLocation();
  const navigate = useNavigate();

  // Effect to update roomId and previousRoomId when the location changes
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const newRoomId = pathParts[pathParts.length - 1];

    if (newRoomId !== roomId) {
      console.log(`Changing room: previous=${roomId}, current=${newRoomId}`);
      setPreviousRoomId(roomId); // Update previousRoomId before changing roomId
      setRoomIdState(newRoomId);
    }
  }, [location.pathname]); // Runs when the URL changes

  const updateRoomId = (id: string | null) => {
    if (id !== roomId) {
      setPreviousRoomId(roomId); // Update previousRoomId before changing roomId
      setRoomIdState(id);
      if (id) {
        navigate(`/Page/${id}`, { replace: true }); // Update the URL
      }
    }
  };

  const setPlayerItems = (
    update: (prevItems: PlayerItem[]) => PlayerItem[]
  ) => {
    setPlayer((prev) => ({ ...prev, items: update(prev.items) }));
  };

  const serializeContext = () => {
    return JSON.stringify({
      roomId,
      previousRoomId, // Include previousRoomId in the serialized context
      player,
    });
  };

  return (
    <GameContext.Provider
      value={{
        roomId,
        previousRoomId,
        setRoomId: updateRoomId,
        player,
        setPlayerItems,
        serializeContext,
      }}
    >
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
