import { useEffect, useState } from "react";
import { ApiBaseUrl } from "../../EnvFile";
import styles from "./DarkRoomDetails.module.css";

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
    action: { actionId: number; description: string; actionTypeId: number };
  }[];
  connectionsFrom?: { connectionId: number; toRoomId: number; description: string }[];
  connectionsTo?: { connectionId: number; fromRoomId: number; description: string }[];
};

type DarkRoomDetailsProps = {
  onExit: () => void;
};

export default function DarkRoomDetails({ onExit }: DarkRoomDetailsProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${ApiBaseUrl}/api/Rooms/4`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }
        return response.json();
      })
      .then((data) => {
        setRoom(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className={styles.text}>Loading...</p>;
  if (error) return <p className={styles.text}>Error: {error}</p>;
  if (!room) return <p className={styles.text}>No room data available.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{room.name || "Unknown Room"}</h1>
      {room.imgUrl && <img src={`${ApiBaseUrl}${room.imgUrl}`} alt={room.name} className={styles.image} />}
      <p className={styles.description}>{room.text || "No description available."}</p>
      
      {room.triggerActions.length > 0 && (
        <div className={styles.actionsContainer}>
          <h2 className={styles.actionsTitle}>Actions</h2>
          <ul className={styles.actionsList}>
            {room.triggerActions.map((action) => (
              <li key={action.actionId} className={styles.actionItem}>{action.description}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={onExit} className={styles.exitButton}>Exit</button>
    </div>
  );
}
