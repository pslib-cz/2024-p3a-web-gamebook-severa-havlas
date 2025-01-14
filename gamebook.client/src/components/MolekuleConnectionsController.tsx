import React, { useState, useEffect } from "react";
import { useGameContext } from "../GameProvider";
import { Navigate, useNavigate } from "react-router-dom";
type Connection = {
  connectionId: number;
  fromRoomId: number;
  toRoomId: number;
};

type RoomRequirements = {
  requiredItems: number[]; // Array of item IDs
  requiredNPCs: any[];
  requiredActions: any[];
};

type RoomDetails = {
  roomId: number;
  name: string;
  text: string;
  imgUrl: string;
  items: any[];
  npCs: any[];
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
  const [roomNames, setRoomNames] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonStates, setButtonStates] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchConnectionsAndRooms = async () => {
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

        const roomNamesMap: Record<number, string> = {};

        // Fetch room names for each connection
        for (const connection of data) {
          const roomResponse = await fetch(
            `https://localhost:7058/api/Rooms/${connection.toRoomId}`
          );

          if (!roomResponse.ok) {
            throw new Error(
              `Error fetching room details for room ${connection.toRoomId}: ${roomResponse.status}`
            );
          }

          const roomDetails: RoomDetails = await roomResponse.json();
          roomNamesMap[connection.toRoomId] = roomDetails.name;
        }

        setRoomNames(roomNamesMap);

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
              (item) => item.itemId === requiredItem
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

    fetchConnectionsAndRooms();
  }, [roomId, player.items]);
  const navigate = useNavigate();
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
        // Synchronize roomId and URL
        navigateToRoom(toRoomId);
        return;
      }
  
      // Compare itemIds to RequiredItemIds
      const missingItemIds = requirements.requiredItems.filter((requiredItemId) => {
        const playerItem = player.items.find(
          (item) => item.itemId === requiredItemId
        );
        return !playerItem || playerItem.quantity <= 0;
      });
  
      console.log("Missing item IDs:", missingItemIds);
  
      if (missingItemIds.length > 0) {
        alert(
          `You are missing the following items: ${missingItemIds.join(", ")}`
        );
        return;
      }
  
      // Synchronize roomId and URL
      navigateToRoom(toRoomId);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  // Helper function to synchronize roomId and URL
  const navigateToRoom = (toRoomId: number) => {
    
    setRoomId(String(toRoomId)); // Update context
    navigate(`/Page/${toRoomId}`); // Update URL
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
              <strong>To Room:</strong> {roomNames[connection.toRoomId] || "Loading..."}
            </p>
            <button
              onClick={() => handleNavigation(connection.toRoomId)}
              disabled={!buttonStates[connection.toRoomId]}
            >
              Go to {roomNames[connection.toRoomId] || "Room"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectionViewer2;
