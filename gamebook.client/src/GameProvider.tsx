import { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface PlayerItem {
  itemId: number;
  itemName: string;
  quantity: number;
}

interface Action {
  actionId: number;
  description: string;
  miniGameData: string;
  actionTypeId: number;
}

interface PreparedAction {
  action: Action;
  source: string;
}

type GameContextType = {
  roomId: string | null;
  previousRoomId: string | null;
  setRoomId: (id: string | null) => void;
  player: {
    items: PlayerItem[];
  };
  setPlayerItems: (update: (prevItems: PlayerItem[]) => PlayerItem[]) => void;
  stamina: number;
  date: Date;
  setStamina: (value: number) => void;
  setDate: (value: Date) => void;
  serializeContext: () => string;
  preparedAction: PreparedAction | null;
  setPreparedAction: (action: PreparedAction | null) => void;

  // New state for managing overlay visibility
  isActionOpen: boolean;
  setIsActionOpen: (open: boolean) => void;
};

export const GameContext = createContext<GameContextType>({
  roomId: "1",
  previousRoomId: null,
  setRoomId: () => {},
  player: { items: [] },
  setPlayerItems: () => {},
  stamina: 100,
  date: new Date(1849, 1, 3),
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
  preparedAction: null,
  setPreparedAction: () => {},

  isActionOpen: false,
  setIsActionOpen: () => {},
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId, setRoomIdState] = useState<string | null>(null);
  const [previousRoomId, setPreviousRoomId] = useState<string | null>(null);
  const [player, setPlayer] = useState<{ items: PlayerItem[] }>({ items: [] });
  const [stamina, setStamina] = useState(100);
  const [date, setDate] = useState(new Date(1849, 1, 3));
  const [preparedAction, setPreparedAction] = useState<PreparedAction | null>(null);
  
  // New state for overlay visibility
  const [isActionOpen, setIsActionOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

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

  const setPlayerItems = (update: (prevItems: PlayerItem[]) => PlayerItem[]) => {
    setPlayer((prev) => ({ ...prev, items: update(prev.items) }));
  };
  const serializeContext = () => {
    return JSON.stringify({
      roomId,
      previousRoomId,
      player,
      stamina,
      date: date.toISOString(),
      preparedAction,
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
        preparedAction,
        setPreparedAction,

        // New values
        isActionOpen,
        setIsActionOpen,
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
