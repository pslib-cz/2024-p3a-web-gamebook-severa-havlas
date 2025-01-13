import React, { useState, useEffect } from "react";
import { useGameContext } from "../GameProvider";

type Connection = {
  connectionId: number;
  fromRoomId: number;
  toRoomId: number;
};

type RoomRequirements = {
  requiredItems: { itemId: number; name: string; description: string }[];
  requiredNPCs: any[];
  requiredActions: any[];
};

type ConnectionViewerProps = {
  roomId: string;
};
interface PlayerItem {
  itemId: number;
  itemName: string;
  quantity: number;
}

const ConnectionViewer2: React.FC<ConnectionViewerProps> = ({ roomId }) => {
  const { setRoomId, player } = useGameContext();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonStates, setButtonStates] = useState<Record<number, boolean>>({});

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

        // Pre-check requirements for each connection and disable buttons as needed
        const states: Record<number, boolean> = {};
        for (const connection of data) {
          const toRoomId = connection.toRoomId;
        
          const reqResponse = await fetch(
            `https://localhost:7058/api/Rooms/Required/${toRoomId}`
          );
        
          if (!reqResponse.ok) {
            throw new Error(
              `Error fetching room requirements for room ${toRoomId}: ${reqResponse.status}`
            );
          }
        
          const requirements: RoomRequirements = await reqResponse.json();
        
          const missingItems = requirements.requiredItems.filter((requiredItem) => {
            const playerItem = player.items.find(
              (item) => item.itemId === requiredItem.itemId
            );
            return !playerItem || playerItem.quantity <= 0;
          });
        
          states[toRoomId] = missingItems.length === 0; // Enable button only if no items are missing
        }
        

        setButtonStates(states);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [roomId, player.items]);

  const handleNavigation = async (toRoomId: number) => {
    try {
      const response = await fetch(
        `https://localhost:7058/api/Rooms/Required/${toRoomId}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching room requirements: ${response.status}`);
      }

      const requirements: RoomRequirements = await response.json();

      if (
        (!requirements.requiredItems || requirements.requiredItems.length === 0) &&
        (!requirements.requiredNPCs || requirements.requiredNPCs.length === 0) &&
        (!requirements.requiredActions || requirements.requiredActions.length === 0)
      ) {
        setRoomId(String(toRoomId));
        return;
      }

      // Check for missing items by ensuring the item exists AND its quantity > 0
      const missingItems = requirements.requiredItems.filter((requiredItem) => {
        const playerItem = player.items.find(
          (item) => item.itemId === requiredItem.itemId
        );
        return !playerItem || playerItem.quantity <= 0;
      });
      
        console.log("Missing items:", missingItems);
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
            <button
              onClick={() => handleNavigation(connection.toRoomId)}
              
            >
              Go to Room {connection.toRoomId}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectionViewer2;
