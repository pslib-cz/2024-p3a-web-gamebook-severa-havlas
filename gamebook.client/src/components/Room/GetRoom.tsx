import React, { useEffect, useState } from "react";
import { Room } from "../../types/types";
import GetRequireds from "../Requireds/GetRequireds";
import ConnectionViewer2 from "../Connections/ConnectionsController";
import RoomContentViewer from "./GetRoomContent";
import styles from "./OrgasmGetRoom.module.css";

type RoomDetailsInputProps = {
  id: string;
  onBackgroundImageChange?: (imageUrl: string) => void;
};

const RoomDetails: React.FC<RoomDetailsInputProps> = ({ id, onBackgroundImageChange }) => {
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
        setRoom({
          ...data,
          connectionsTo: data.connectionsTo || [],
          connectionsFrom: data.connectionsFrom || [],
          items: data.items || [],
          npcs: data.npcs || [],
        });

        // Pokud má místnost URL obrázku, nastavíme jej jako pozadí
        if (data.imgUrl && onBackgroundImageChange) {
          //onBackgroundImageChange(`https://localhost:7058${data.imgUrl}`);
        }
      } catch (error) {
        console.error(error);
        setError("Error fetching room.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, onBackgroundImageChange]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!room) return <div>Room not found.</div>;

  return (
    <div className={styles.room}>
      <img className={styles.image} src={`https://localhost:7058${room.imgUrl}`} alt={room.name} />
      <div className={styles.description}>
        <h1>{room.name}</h1>
        <p>{room.text}</p>
        <h2>Requireds</h2>
        <GetRequireds roomId={id} />
        <h2>Items</h2>
        <ul>
          {room.items.map((item) => (
            <li key={item.itemId}>{item.name}</li>
          ))}
        </ul>
        <h2>Řízení</h2>
        <ConnectionViewer2 roomId={id} />
        <h2>Content</h2>
        <RoomContentViewer roomId={id} />
      </div>
    </div>
  );
};

export default RoomDetails;
