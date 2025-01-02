import { createContext, useState, useContext  } from "react";

// Define the shape of your context
type GameContextType = {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
}

// Create the context with a default value
export const GameContext = createContext<GameContextType>({
  roomId: "1",
  setRoomId: () => {},
});

// Create a Provider component to wrap your app
export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId, setRoomId] = useState<string | null>("1");

  return (
    <GameContext.Provider value={{ roomId, setRoomId }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for easier context consumption
export const useGameContext = () => {
 

    const context = useContext(GameContext);
   
    if (!context) {
      throw new Error("useRoomContext must be used within a RoomProvider");
    }
    return context;
  };
export default RoomProvider;
