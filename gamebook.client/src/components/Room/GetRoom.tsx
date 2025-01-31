import React, { useEffect, useState } from "react";
import RoomContentViewer from "./GetRoomContent";
import SlidingOverlay from "../Minigames/Overlay";
import styles from "./GetRoom.module.css";
import { useGameContext } from "../../GameProvider";
import { ApiBaseUrl } from "../../EnvFile";
import Typewriter from "typewriter-effect";

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
    npCs: {
      npcId: number;
      name: string;
      dialogs: { dialogId: number; text: string }[];
      action: { actionId: number; description: string; actionTypeId: number, miniGameData: string };
    }[];
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

type Room = {
  roomId: number;
  imgUrl: string;
  name: string;
  text: string;
  triggerActions: {
    actionId: number;
    description: string;
    miniGameData: string;
    actionTypeId: number;
  }[];
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
  npCs: {
    npcId: number;
    name: string;
    dialogs: { dialogId: number; text: string }[];
    action: { actionId: number; description: string; actionTypeId: number; miniGameData: string };
  }[];
  connectionsFrom: { connectionId: number; toRoomId: number; description: string }[];
  connectionsTo: { connectionId: number; fromRoomId: number; description: string }[];
};

const RoomDetails: React.FC<RoomDetailsInputProps> = ({ id, onBackgroundImageChange }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [connections, setConnections] = useState<Connection[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { serializeContext,preparedAction , setRoomId, stamina, setStamina, date, setIsOverlayOpen } = useGameContext();

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${ApiBaseUrl}/api/Rooms/${id}`);
        if (!response.ok) throw new Error("Failed to fetch room");

        const data: Room = await response.json();
        setRoom({
          ...data,
          connectionsTo: data.connectionsTo || [],
          connectionsFrom: data.connectionsFrom || [],
          items: data.items || [],
          npCs: data.npCs || [],
        });

        if (data.imgUrl && onBackgroundImageChange) {
          onBackgroundImageChange(`${ApiBaseUrl}${data.imgUrl}`);
        }

        // Open overlay if triggerActions exist
        setIsOverlayOpen(data.triggerActions && data.triggerActions.length > 0);
      } catch (error) {
        console.error(error);
        setError("Error fetching room.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, onBackgroundImageChange, setIsOverlayOpen]);

  useEffect(() => {
    if (!id) return;

    const fetchConnections = async () => {
      setLoading(true);
      setError(null);

      try {
        const gameState = serializeContext();

        const response = await fetch(
          `${ApiBaseUrl}/api/Rooms/${id}/Connection?gameState=${encodeURIComponent(gameState)}`
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
    setStamina(stamina - 10);
    setRoomId(String(toRoomId));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!room) return <div>Room not found.</div>;

  const roomContent: RoomContentViewerProps["roomContent"] = {
    npCs: room.npCs.map((npc) => ({
      npcId: npc.npcId,
      name: npc.name,
      dialogs: npc.dialogs,
      action: {
        ...npc.action,
        miniGameData: npc.action.miniGameData || "",
      },
    })),
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
      <SlidingOverlay
        isOpen={room.triggerActions && room.triggerActions.length > 0}
        overlayWidth="60%"
        triggerActions={room.triggerActions || []}
      />
      <div className={styles.room}>
        <img className={styles.image} src={`${ApiBaseUrl}${room.imgUrl}`} alt={room.name} />

        {connections?.map((connection) =>
          connection.imgUrl && connection.x && connection.y ? (
            <img
              key={connection.toRoomId}
              src={`${ApiBaseUrl}${connection.imgUrl}`}
              alt="Connection image"
              style={{
                position: "absolute",
                left: `${connection.x / 10}%`,
                top: `${connection.y / 10}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ) : null
        )}

        <div className={styles.description}>
          <h1>{room.name}</h1>
          <Typewriter options={{ strings: [room.text], autoStart: true, loop: false, delay: 75 }} />
          <h2>Items</h2>
          <ul>
            {room.items.map((item) => (
              <li key={item.itemPositionId}>{item.item ? item.item.name : "Unknown item"}</li>
            ))}
          </ul>
          <div>
            <h2>Player Stats</h2>
            <p><strong>Stamina:</strong> {stamina}</p>
            <p><strong>Date:</strong> {date.toDateString()}</p>
          </div>
          <h2>Room Connections</h2>
          <ul>
            {connections?.map((connection) => (
              <li key={connection.toRoomId}>
                <strong>To Room ID:</strong> {connection.toRoomId}
                <button
                  onClick={() => navigateToRoom(connection.toRoomId)}
                  disabled={!connection.state}
                  title={!connection.state ? "You need certain items to unlock this room." : ""}
                >
                  Go to Room {connection.toRoomId}
                </button>
              </li>
            ))}
          </ul>
          <RoomContentViewer roomContent={roomContent} />
          {JSON.stringify(preparedAction)}
        </div>
        
      </div>
    </>
  );
};

export default RoomDetails;
