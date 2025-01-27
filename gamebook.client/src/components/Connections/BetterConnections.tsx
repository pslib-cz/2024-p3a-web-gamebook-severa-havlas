import React, { useState, useEffect } from "react";
import { useGameContext } from "../../GameProvider";

import { Navigate, useNavigate } from "react-router-dom";
type Connection = {
  fromRoomId: number;
  toRoomId: number;
  x: number | null;
  y: number | null;
  img: string | null;
  state: boolean;
};


export const RoomConnections: React.FC = () => {
  const { roomId, serializeContext } = useGameContext();
  const [connections, setConnections] = useState<Connection[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!roomId) return;

    const fetchConnections = async () => {
      setLoading(true);
      setError(null);

      try {
        // Serialize the context to send as a query parameter
        const gameState = serializeContext();
        
        // Send GET request to the API
        const response = await fetch(
          `https://localhost:7058/api/Rooms/${roomId}/Connection?gameState=${encodeURIComponent(gameState)}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching connections: ${response.statusText}`);
        }

        const data: Connection[] = await response.json();
        setConnections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [roomId, serializeContext]);

  if (loading) return <div>Loading connections...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!connections || connections.length === 0) return <div>No connections found.</div>;
 //const navigate = useNavigate();
   const { setRoomId, player } = useGameContext();
  const navigateToRoom = (toRoomId: number) => {
    
    setRoomId(String(toRoomId)); // Update context
    //navigate(`/Page/${toRoomId}`); // Update URL
  };

  return (
    <div>
      <h2>Room Connections</h2>
      <ul>
        {connections.map((connection) => (
          <li key={connection.toRoomId}>
            <div>
              <strong>To Room ID:</strong> {connection.toRoomId}
            </div>
            <div>
              <strong>Position:</strong> ({connection.x}, {connection.y})
            </div>
            <div>
            <button
  onClick={() => navigateToRoom(connection.toRoomId)}
  disabled={!connection.state}
  title={!connection.state ? "You need certain items to unlock this room." : ""}
>
  Go to Room {connection.toRoomId}
</button>
            </div>
            <div>
              <strong>State:</strong> {connection.state ? "Accessible" : "Blocked"}
            </div>
            {connection.img && (
              <img src={`https://localhost:7058${connection.img}`}   alt={`Room ${connection.toRoomId} connection image`}/>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};


