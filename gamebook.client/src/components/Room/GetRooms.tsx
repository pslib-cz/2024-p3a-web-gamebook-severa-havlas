import React, { useEffect, useState } from "react";

type Room = {
  roomId: number;
  name: string;
  text: string;
  imgUrl: string;
};

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("https://localhost:7058/api/Rooms");
        if (!response.ok) throw new Error("Failed to fetch rooms");

        const data: Room[] = await response.json();
        setRooms(data);
      } catch (error) {
        console.error(error);
        alert("Error fetching rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>All Rooms</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.roomId}>
            <h2>{room.name}</h2>
            <p>{room.roomId}</p>
            <p>{room.text}</p>
            <img src={"https://localhost:7058"+room.imgUrl} alt={room.name} width={200} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
