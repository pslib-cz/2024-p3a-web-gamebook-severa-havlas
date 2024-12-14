import React, { useState, useEffect } from 'react';
import { Room } from '../types/types';

const RoomManager: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for new/updated room
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms(); // Reuse client function
        setRooms(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleAddRoom = async (newRoom: Room) => {
    try {
      const addedRoom = await postRoom(newRoom);
      setRooms([...rooms, addedRoom]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateRoom = async (updatedRoom: Room) => {
    try {
      await putRoom(updatedRoom.roomId, updatedRoom);
      setRooms(
        rooms.map((room) =>
          room.roomId === updatedRoom.roomId ? updatedRoom : room
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      await deleteRoom(id);
      setRooms(rooms.filter((room) => room.roomId !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Room Manager</h1>
      <button onClick={() => setCurrentRoom({ roomId: 0, img: '', name: '', text: '', items: [], npcs: [], itemPositions: [], connectionsFrom: [], connectionsTo: [], requiredItems: [], requiredNPCs: [], requiredActions: [] })}>
        Add Room
      </button>
      {currentRoom && (
        <div>
          <h2>{currentRoom.roomId ? 'Edit Room' : 'Add Room'}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentRoom.roomId) {
                handleUpdateRoom(currentRoom);
              } else {
                handleAddRoom(currentRoom);
              }
              setCurrentRoom(null); // Close form
            }}
          >
            <input
              type="text"
              placeholder="Name"
              value={currentRoom.name}
              onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={currentRoom.text}
              onChange={(e) => setCurrentRoom({ ...currentRoom, text: e.target.value })}
            />
            <button type="submit">Save</button>
            <button onClick={() => setCurrentRoom(null)}>Cancel</button>
          </form>
        </div>
      )}
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
const postRoom = async (room: Room) => {
  const response = await fetch('/api/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(room),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
};

const putRoom = async (id: number, room: Room) => {
    const response = await fetch(`/api/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  };
  
  // Improved PATCH function: reusable for updates
  const patchRoom = async (id: number, patchData: Partial<Room>) => {
    const response = await fetch(`/api/rooms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json-patch+json' },
      body: JSON.stringify(patchData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json(); // Return updated room (optional)
  };
  
  // Utility function to fetch all rooms
  const getAllRooms = async (): Promise<Room[]> => {
    const response = await fetch('/api/rooms');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  };

  // Function to delete a room
  const deleteRoom = async (id: number) => {
    const response = await fetch(`/api/rooms/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  };
  