import React, { useState, useEffect } from 'react';
import { Room } from '../types/types';

const RoomsList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]); // State to store rooms
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('https://localhost:62986/api/rooms'); // Adjust endpoint if necessary
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Room[] = await response.json(); // Parse JSON response into Room[]
        setRooms(data); // Update state with fetched rooms
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Rooms List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.roomId}>
              <td>{room.roomId}</td>
              <td>
                <img
                  src={`data:image/png;base64,${room.img}`}
                  alt={room.name}
                  style={{ width: '100px', height: 'auto' }}
                />
              </td>
              <td>{room.name}</td>
              <td>{room.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomsList;
