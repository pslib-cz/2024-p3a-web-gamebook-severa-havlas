import { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {ApiBaseUrl} from "./EnvFile";
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
  player: { items: PlayerItem[] };
  setPlayerItems: (update: (prevItems: PlayerItem[]) => PlayerItem[]) => void;
  stamina: number;
  date: Date;
  setStamina: (value: number) => void;
  setDate: (value: Date) => void;
  serializeContext: () => string;
  preparedAction: PreparedAction | null;
  setPreparedAction: (action: PreparedAction | null) => void;

  // Overlay visibility
  isActionOpen: boolean;
  setIsActionOpen: (open: boolean) => void;

  // Authentication
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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

  // Authentication
  user: null,
  login: async () => {},
  logout: () => {},
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId, setRoomIdState] = useState<string | null>(null);
  const [previousRoomId, setPreviousRoomId] = useState<string | null>(null);
  const [player, setPlayer] = useState<{ items: PlayerItem[] }>({ items: [] });
  const [stamina, setStamina] = useState(100);
  const [date, setDate] = useState(new Date(1849, 1, 3));
  const [preparedAction, setPreparedAction] = useState<PreparedAction | null>(null);

  const [isActionOpen, setIsActionOpen] = useState(false);

  // Authentication state
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Auto-update roomId based on URL
    const pathParts = location.pathname.split("/");
    const newRoomId = pathParts[pathParts.length - 1];

    if (newRoomId !== roomId) {
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

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${ApiBaseUrl}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      const loggedInUser = {
        email,
        role: data.role, // Assuming API returns user role
      };

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      if (loggedInUser.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
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
        isActionOpen,
        setIsActionOpen,

        // Auth values
        user,
        login,
        logout,
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
