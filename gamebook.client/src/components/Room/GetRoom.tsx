import React, { useEffect, useState } from "react";

import RoomContentViewer from "./GetRoomContent";
import styles from "./GetRoom.module.css";
import { RoomConnections } from "../Connections/BetterConnections";
import SlidingOverlay from "../Minigames/Overlay";

type RoomDetailsInputProps = {
  id: string;
  onBackgroundImageChange?: (imageUrl: string) => void;
};

type RoomContentViewerProps = {
  roomContent: {
    npCs: { npcId: number; name: string }[];
    items: {
      itemPositionId: number;
      roomId: number;
      x: number;
      y: number;
      itemId: number;
      item: {
        itemId: number;
        name: string;
        description: string;
      } | null;
    }[];
  };
};

export type Room = {
  roomId: number;
  imgUrl: string;
  name: string; // Name of the room
  text: string; // Description of the room
  triggerActions: { actionId: number; description: string; miniGameData: string; actionTypeId: number }[]; // Actions triggered when entering the room
  items: {
    itemPositionId: number;
    roomId: number;
    x: number;
    y: number;
    itemId: number;
    item: {
      itemId: number;
      name: string;
      description: string;
    } | null;
  }[]; // Collection of items in the room
  npcs: { npcId: number; name: string }[]; // Collection of NPCs in the room

  connectionsFrom: { connectionId: number; toRoomId: number; description: string }[]; // Connections originating from this room
  connectionsTo: { connectionId: number; fromRoomId: number; description: string }[]; // Connections leading to this room
};

const RoomDetails: React.FC<RoomDetailsInputProps> = ({ id, onBackgroundImageChange }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);

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

        // Set background image if URL is present
        if (data.imgUrl && onBackgroundImageChange) {
          onBackgroundImageChange(`https://localhost:7058${data.imgUrl}`);
        }

        // Check if trigger actions exist and open overlay if they do
        setIsOverlayOpen(data.triggerActions && data.triggerActions.length > 0);
      } catch (error) {
        console.error(error);
        setError("Error fetching room.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();

    // Cleanup/reset overlay state when component unmounts or room changes
    return () => setIsOverlayOpen(false);
  }, [id, onBackgroundImageChange]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!room) return <div>Room not found.</div>;

  // Transform room data for RoomContentViewer
  const roomContent: RoomContentViewerProps["roomContent"] = {
    npCs: room.npcs.map((npc) => ({ npcId: npc.npcId, name: npc.name })),
    items: room.items.map((item) => ({
      itemPositionId: item.itemPositionId,
      roomId: item.roomId,
      x: item.x,
      y: item.y,
      itemId: item.itemId,
      item: item.item ? { ...item.item } : null,
    })),
  };

  return (
    <>
      <SlidingOverlay isOpen={isOverlayOpen} overlayWidth="60%"  onClose={() => setIsOverlayOpen(false)} triggerActions={room?.triggerActions || []}/>
      <div className={styles.room}>
        <img className={styles.image} src={`https://localhost:7058${room.imgUrl}`} alt={room.name} />
        <div className={styles.description}>
          <h1>{room.name}</h1>
          <p>{room.text}</p>
          <h2>Requireds</h2>

          <h2>Items</h2>
          <ul>
            {room.items.map((item) => (
              <li key={item.itemPositionId}>{item.item ? item.item.name : "Unknown item"}</li>
            ))}
          </ul>
          <h2>Řízení</h2>
          <ul>
            {room.triggerActions.map((action) => (
              <li key={action.actionId}>
                {action.description}, {action.actionTypeId}, {action.miniGameData}
              </li>
            ))}
          </ul>
          <h2>Content</h2>
          <RoomContentViewer roomContent={roomContent} />
          <RoomConnections />
          {JSON.stringify(room)}
        </div>
      </div>
    </>
  );
};

export default RoomDetails;
