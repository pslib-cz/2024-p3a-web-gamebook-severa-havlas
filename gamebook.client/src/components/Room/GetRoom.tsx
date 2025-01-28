import React, { useEffect, useState } from "react";
import RoomContentViewer from "./GetRoomContent";
import SlidingOverlay from "../Minigames/Overlay";
import styles from "./GetRoom.module.css";
import { useGameContext } from "../../GameProvider";

type Connection = {
  fromRoomId: number;
  toRoomId: number;
  x: number | null;
  y: number | null;
  imgUrl: string | null;
  state: boolean;
};

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
  name: string;
  text: string;
  triggerActions: { actionId: number; description: string; miniGameData: string; actionTypeId: number }[];
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
  npcs: { npcId: number; name: string }[];
  connectionsFrom: { connectionId: number; toRoomId: number; description: string }[];
  connectionsTo: { connectionId: number; fromRoomId: number; description: string }[];
};

const RoomDetails: React.FC<RoomDetailsInputProps> = ({ id, onBackgroundImageChange }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [connections, setConnections] = useState<Connection[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);

  const { serializeContext, setRoomId } = useGameContext();

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

  useEffect(() => {
    if (!id) return;

    const fetchConnections = async () => {
      setLoading(true);
      setError(null);

      try {
        const gameState = serializeContext();

        const response = await fetch(
          `https://localhost:7058/api/Rooms/${id}/Connection?gameState=${encodeURIComponent(gameState)}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching connections: ${response.statusText}`);
        }

        const data: Connection[] = await response.json();
        setConnections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [id, serializeContext]);

  const navigateToRoom = (toRoomId: number) => {
    setRoomId(String(toRoomId)); // Update context
  };

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
      <SlidingOverlay isOpen={isOverlayOpen} overlayWidth="60%" onClose={() => setIsOverlayOpen(false)} triggerActions={room.triggerActions || []} />
      <div className={styles.room} style={{ position: 'relative' }}>
        {/* Background image */}
        <img className={styles.image} src={`https://localhost:7058${room.imgUrl}`} alt={room.name} />

        {/* Items and Connections images */}
        {connections?.map((connection) => (
          connection.imgUrl && connection.x && connection.y ? (
            <img
              key={connection.toRoomId}
              src={`https://localhost:7058${connection.imgUrl}`}
              alt={`Connection image`}
              style={{
                position: 'absolute',
                left: `${connection.x / 10}%`,  // Convert to percentage
                top: `${connection.y / 10}%`,  // Convert to percentage
                transform: 'translate(-50%, -50%)'  // Center image on the point
              }}
            />
          ) : null
        ))}
        
        {/* Render the rest of your component */}
        <div className={styles.description}>
          <h1>{room.name}</h1>
          <p>{room.text}</p>
          <h2>Items</h2>
          <ul>
            {room.items.map((item) => (
              <li key={item.itemPositionId}>
                {item.item ? item.item.name : "Unknown item"}
              </li>
            ))}
          </ul>
          <h2>Room Connections</h2>
          <ul>
            {connections && connections.length > 0 ? (
              connections.map((connection) => (
                <li key={connection.toRoomId}>
                  <div>
                    <strong>To Room ID:</strong> {connection.toRoomId}
                  </div>
                  <div>
                    <strong>Position:</strong> ({connection.x}, {connection.y})
                  </div>
                  <div>
                    <button
                      onClick={() => navigateToRoom(connection.toRoomId)}
                      disabled={!connection.state}
                      title={!connection.state ? "You need certain items to unlock this room." : ""}
                    >
                      Go to Room {connection.toRoomId}
                    </button>
                  </div>
                  <div>
                    <strong>State:</strong> {connection.state ? "Accessible" : "Blocked"}
                  </div>
                </li>
              ))
            ) : (
              <li>No connections found.</li>
            )}
          </ul>
          {/* Room content */}
          <RoomContentViewer roomContent={roomContent} />
        </div>
      </div>
    </>
  );
};

export default RoomDetails;
