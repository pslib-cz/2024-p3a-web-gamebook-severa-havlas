import React, { useState, useEffect } from "react";
import { useGameContext } from "../../GameProvider";

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
        const roomId = 2;
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
              <strong>State:</strong> {connection.state ? "Accessible" : "Blocked"}
            </div>
            {connection.img && (
              <img src={`data:image/png;base64,${connection.img}`} alt={`Connection to Room ${connection.toRoomId}`} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};


