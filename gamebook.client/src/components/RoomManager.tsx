import React, { useState, useEffect } from 'react';
import { Room } from '../types/types';
import MolekulePostRoomForm from './MolekulePostRoomForm';

// API utility functions
import { getAllRooms, deleteRoom } from '../queries/RoomApi';

const RoomManager: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  let roomsStringified;
  // Fetch all rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms();
        setRooms(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

 


  // Handle deleting a room
  const handleDeleteRoom = async (id: number) => {
    try {
      await deleteRoom(id);
      setRooms(rooms.filter((room) => room.roomId !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Render loading or error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Room Manager</h1>

      {/* Button to open "Add Room" form */}
      <button
        onClick={() =>
          setCurrentRoom({
            roomId: 0,
            img: '',
            name: '',
            text: '',
            items: [],
            npcs: [],
            itemPositions: [],
            connectionsFrom: [],
            connectionsTo: [],
            requiredItems: [],
            requiredNPCs: [],
            requiredActions: [],
          })
        }
      >
        Add Room
      </button>

      {/* MolekulePostRoomForm for Adding/Editing */}
      {currentRoom && (
        <div style={{ margin: '20px 0' }}>
          <h2>{currentRoom.roomId ? 'Edit Room' : 'Add Room'}</h2>
          <MolekulePostRoomForm
           
          />
        </div>
      )}

      {/* Room List Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room: Room) => (
            roomsStringified = JSON.stringify(rooms),
            console.log(roomsStringified),
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
              <td>
                <button onClick={() => setCurrentRoom(room)}>Edit</button>
                <button onClick={() => handleDeleteRoom(room.roomId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomManager;
