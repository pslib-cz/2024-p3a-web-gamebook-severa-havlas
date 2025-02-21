import React, { useEffect, useState } from "react";
import { Connection } from "../../types/types2";
import { ApiBaseUrl } from "../../EnvFile";
const ConnectionsList: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch connections from the API using fetch
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch(`${ApiBaseUrl}/api/connections`); // Replace with the actual endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Connection[] = await response.json();
        setConnections(data);
      } catch (err) {
        setError("Failed to fetch connections.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Connections</h2>
      {connections.length > 0 ? (
        <table border={1} color="black">
          <thead>
            <tr>
              <th>Connection ID</th>
              <th>From Room ID</th>
              <th>To Room ID</th>
            </tr>
          </thead>
          <tbody>
            {connections.map((connection) => (
              <tr key={connection.connectionId}>
                <td>{connection.connectionId}</td>
                <td>{connection.fromRoomId}</td>
                <td>{connection.toRoomId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No connections found.</p>
      )}
    </div>
  );
};

export default ConnectionsList;
