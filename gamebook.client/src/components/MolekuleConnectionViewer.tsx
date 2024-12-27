import React, { useEffect, useState } from "react";
import { Connection } from "../types/types";
import { useGameContext } from "../GameProvider";

type ConnectionViewerInputProps = {
  id: string; // The room ID for fetching connections
};

const ConnectionsViewer: React.FC<ConnectionViewerInputProps> = ({ id }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { setRoomId } = useGameContext(); // Access context function to update the room ID

  // Function to fetch connections
  const fetchConnections = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data: Connection[] = await response.json();
      setConnections(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect to fetch connections whenever the `id` changes
  useEffect(() => {
    if (id) {
      const endpoint = `https://localhost:7058/api/Connections/GetFromConnection/${id}`;
      fetchConnections(endpoint);
    }
  }, [id]);

  return (
    <div>
      <h1>Connections Viewer</h1>

      {/* Display error message */}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {/* Display loading indicator */}
      {loading && <div>Loading...</div>}

      {/* Display fetched connections */}
      <div>
        <h2>Connections</h2>
        {connections.length > 0 ? (
          <table border={1}>
            <thead>
              <tr>
                <th>Connection ID</th>
                <th>From Room ID</th>
                <th>To Room ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((connection) => (
                <tr key={connection.connectionId}>
                  <td>{connection.connectionId}</td>
                  <td>{connection.fromRoomId}</td>
                  <td>{connection.toRoomId}</td>
                  <td>
                    <button onClick={() => setRoomId(String(connection.toRoomId))}>
                      Go to Room {connection.toRoomId}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No connections found.</p>
        )}
      </div>
    </div>
  );
};

export default ConnectionsViewer;
