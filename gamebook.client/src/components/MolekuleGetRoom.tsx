import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Room = {
  roomId: number;
  name: string;
  text: string;
  imgUrl: string;
  items: { itemId: number; name: string }[];
  npcs: { npcId: number; name: string }[];
};

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`https://localhost:7058/api/Rooms/${id}`);
        if (!response.ok) throw new Error("Failed to fetch room");

        const data: Room = await response.json();
        setRoom(data);
      } catch (error) {
        console.error(error);
        alert("Error fetching room.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!room) return <div>Room not found.</div>;

  return (
    <div>
      <h1>{room.name}</h1>
      <img src={room.imgUrl} alt={room.name} width={400} />
      <p>{room.text}</p>
      <h2>Items</h2>
      <ul>
        {room.items.map((item) => (
          <li key={item.itemId}>{item.name}</li>
        ))}
      </ul>
      <h2>NPCs</h2>
      <ul>
        {room.npcs.map((npc) => (
          <li key={npc.npcId}>{npc.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RoomDetails;
