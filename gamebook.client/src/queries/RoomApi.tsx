import { Room } from '../types/types';

// Base API URL (you can replace this with your actual backend URL)
const BASE_URL = 'https://localhost:7058/api/rooms';

// Utility function for error handling
const checkResponse = async (response: Response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Error: ${response.status} - ${errorMessage}`);
  }
  return response.json();
};

// Fetch all rooms
export const getAllRooms = async (): Promise<Room[]> => {
  const response = await fetch(BASE_URL);
  return checkResponse(response);
};

// Post (add) a new room




// Patch (partial update) a room
export const patchRoom = async (
  id: number,
  patchData: Partial<Room>
): Promise<Room> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json-patch+json' },
    body: JSON.stringify(patchData),
  });
  return checkResponse(response);
};

// Delete a room
export const deleteRoom = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
};
const renderImageFromBase64 = (base64String: string) => {
    if (!base64String) return null;
    return <img src={base64String} alt="Room Image" style={{ width: '200px', height: 'auto' }} />;
  };