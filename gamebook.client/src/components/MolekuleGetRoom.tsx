import React, { useEffect, useState } from "react";
import { Room } from "../types/types";
import ConnectionsViewer from "./MolekuleConnectionViewer";
import GetRequireds from "./MolekuleGetRequireds";
type RoomDetailsInputProps = {
  id: string;
};

const RoomDetails: React.FC<RoomDetailsInputProps> = ({ id }) => {
 
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://localhost:7058/api/Rooms/${id}`);
        if (!response.ok) throw new Error("Failed to fetch room");

        const data: Room = await response.json();
        // Provide default values for `items` and `npcs` if they are missing
        setRoom({
          ...data,
          connectionsTo: data.connectionsTo || [],
          connectionsFrom: data.connectionsFrom || [],
          items: data.items || [],
          npcs: data.npcs || [],
        });
      } catch (error) {
        console.error(error);
        setError("Error fetching room.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  if (!room) return <div>Room not found.</div>;

  return (
    
    <div>
      <h1>{room.name}</h1>
      <img src={"https://localhost:7058"+room.imgUrl} alt={room.name} width={400} />
      <p>{room.text}</p>
      <h2>ConnectionsTo</h2>
   <ConnectionsViewer id={id} />
   <h2>Requireds</h2>
   <GetRequireds roomId={id} />
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
      {JSON.stringify(room)}
    </div>
    
  );
};

export default RoomDetails;
