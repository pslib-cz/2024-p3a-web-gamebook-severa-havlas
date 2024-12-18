import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Room, Connection } from '../types/types'; // Assuming Room and Connection types are defined in ../types/types

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract room ID from URL params
  const [data, setData] = useState<Room | null>(null); // Room data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    if (!id) {
      setError('Room ID is missing');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`https://localhost:7058/api/rooms/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const roomData: Room = await response.json();
        setData(roomData);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Re-run the effect if the room ID changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data && (
        <div>
          <h1>{data.name}</h1>
          <p>{data.text}</p>
          <img
            src={`data:image/png;base64,${data.img}`}
            alt={data.name}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <h2>Connections</h2>
          <div>
            <h3>From this room:</h3>
            {data.connectionsFrom && data.connectionsFrom.length > 0 ? (
              <ul>
                {data.connectionsFrom.map((connection: Connection) => (
                  <li key={connection.connectionId}>
                    To Room ID: {connection.toRoomId}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No outgoing connections.</p>
            )}
          </div>
          <div>
            <h3>To this room:</h3>
            {data.connectionsTo && data.connectionsTo.length > 0 ? (
              <ul>
                {data.connectionsTo.map((connection: Connection) => (
                  <li key={connection.connectionId}>
                    From Room ID: {connection.fromRoomId}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No incoming connections.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
