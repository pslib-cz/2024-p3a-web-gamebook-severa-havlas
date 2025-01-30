import { useEffect, useState } from "react";
import { ApiBaseUrl } from "../../EnvFile";

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
      action: { actionId: number; description: string,actionTypeId: number  };
    }[];
    connectionsFrom: { connectionId: number; toRoomId: number; description: string }[];
    connectionsTo: { connectionId: number; fromRoomId: number; description: string }[];
  };
type DarkRoomDetailsProps = {
  onExit: () => void;
};

export default function DarkRoomDetails({ onExit }: DarkRoomDetailsProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!room) return <p>No room data available.</p>;

  return (
    <div className="p-4 bg-black text-white">
      <h1 className="text-xl font-bold">{room.name || "Unknown Room"}</h1>
      {room.imgUrl && <img src={`${ApiBaseUrl}${room.imgUrl}`} alt={room.name} className="w-full h-auto" />}
      <p>{room.text || "No description available."}</p>

      <button onClick={onExit} className="mt-4 p-2 bg-gray-700 text-white">Exit</button>
    </div>
  );
}
