import { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface PlayerItem {
  itemId: number;
  itemName: string;
  quantity: number;
}

type GameContextType = {
  roomId: string | null;
  previousRoomId: string | null; // Tracks the previous room
  setRoomId: (id: string | null) => void;
  player: {
    items: PlayerItem[];
  };
  setPlayerItems: (update: (prevItems: PlayerItem[]) => PlayerItem[]) => void;
  stamina: number; // Added stamina
  date: Date; // Added date
  setStamina: (value: number) => void; // Function to update stamina
  setDate: (value: Date) => void; // Function to update date
  serializeContext: () => string;
};

export const GameContext = createContext<GameContextType>({
  roomId: "1",
  previousRoomId: null,
  setRoomId: () => {},
  player: { items: [] },
  setPlayerItems: () => {},
  stamina: 100, // Default stamina
  date: new Date(1849, 1, 3), // Default date (Feb 3, 1849)
  setStamina: () => {},
  setDate: () => {},
  serializeContext: () =>
    JSON.stringify({
      roomId: "1",
      previousRoomId: null,
      player: { items: [] },
      stamina: 100,
      date: new Date(1849, 1, 3).toISOString(),
    }),
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [roomId, setRoomIdState] = useState<string | null>(null);
  const [previousRoomId, setPreviousRoomId] = useState<string | null>(null);
  const [player, setPlayer] = useState<{ items: PlayerItem[] }>({ items: [] });
  const [stamina, setStamina] = useState(100); // State for stamina
  const [date, setDate] = useState(new Date(1849, 1, 3)); // State for date

  const location = useLocation();
  const navigate = useNavigate();

  // Effect to update roomId and previousRoomId when the location changes
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const newRoomId = pathParts[pathParts.length - 1];

    if (newRoomId !== roomId) {
      console.log(`Changing room: previous=${roomId}, current=${newRoomId}`);
      setPreviousRoomId(roomId);
      setRoomIdState(newRoomId);
    }
  }, [location.pathname]);

  const updateRoomId = (id: string | null) => {
    if (id !== roomId) {
      setPreviousRoomId(roomId);
      setRoomIdState(id);
      if (id) {
        navigate(`/Page/${id}`, { replace: true });
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
      previousRoomId,
      player,
      stamina,
      date: date.toISOString(), // Serialize the date as an ISO string
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
        stamina,
        date,
        setStamina,
        setDate,
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
