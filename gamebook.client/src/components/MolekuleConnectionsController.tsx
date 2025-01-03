import React, { useState, useEffect, useContext } from "react";

// Define the context type
type GameContextType = {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  player: {
    items: Record<string, string>; // Items in key-value format
  };
  setPlayerItems: (items: Record<string, string>) => void;
};

// Mock the GameContext
const GameContext = React.createContext<GameContextType>({
  roomId: null,
  setRoomId: () => {},
  player: { items: {} },
  setPlayerItems: () => {},
});

type Connection = {
  connectionId: number;
  fromRoomId: number;
  toRoomId: number;
};

type RoomRequirements = {
  requiredItems: { itemId: number; name: string; description: string }[];
  requiredNPCs: any[]; // Not used but included for context
  requiredActions: any[]; // Not used but included for context
};

type ConnectionViewerProps = {
  roomId: string;
};

const ConnectionViewer2: React.FC<ConnectionViewerProps> = ({ roomId }) => {
    const { setRoomId, player } = useContext(GameContext);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchConnections = async () => {
        setError(null);
        setLoading(true);
  
        try {
          const response = await fetch(
            `https://localhost:7058/api/Connections/GetFromConnection/${roomId}`
          );
  
          if (!response.ok) {
            throw new Error(`Error fetching connections: ${response.status}`);
          }
  
          const data: Connection[] = await response.json();
          setConnections(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchConnections();
    }, [roomId]);
  
    const handleNavigation = async (toRoomId: number) => {
      try {
        const response = await fetch(
          `https://localhost:7058/api/Rooms/Required/${toRoomId}`
        );
  
        if (!response.ok) {
          throw new Error(`Error fetching room requirements: ${response.status}`);
        }
  
        const requirements: RoomRequirements = await response.json();
        console.log("Room Requirements:", requirements);
  
        if (!requirements.requiredItems || requirements.requiredItems.length === 0) {
          setRoomId(String(toRoomId));
          return;
        }
  
        const missingItems = requirements.requiredItems.filter(
          (item) => !player.items[item.name]
        );
  
        if (missingItems.length > 0) {
          alert(
            `You are missing the following items: ${missingItems
              .map((item) => item.name)
              .join(", ")}`
          );
          return;
        }
  
        setRoomId(String(toRoomId));
      } catch (err) {
        setError((err as Error).message);
      }
    };
  
    if (loading) {
      return <div>Loading connections...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    if (connections.length === 0) {
      return <div>No connections available.</div>;
    }
  
    return (
      <div>
        <h1>Connections</h1>
        <ul>
          {connections.map((connection) => (
            <li key={connection.connectionId}>
              <p>
                <strong>To Room ID:</strong> {connection.toRoomId}
              </p>
              <button onClick={() => handleNavigation(connection.toRoomId)}>
                Go to Room {connection.toRoomId}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default ConnectionViewer2;
