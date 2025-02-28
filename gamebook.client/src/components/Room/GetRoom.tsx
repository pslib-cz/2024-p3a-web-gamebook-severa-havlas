import React, { useEffect, useState } from "react";
import RoomContentViewer, {RoomContentViewerProps} from "./GetRoomContent";
import styles from "./GetRoom.module.css";
import { useGameContext } from "../../GameProvider";
import { ApiBaseUrl } from "../../EnvFile";
import ActionForm from "../ActionHandler/ActionForm";
import TextEditor from "../Atoms/TextEditor";
import Checklist from "../Atoms/Checklist";
import Map from "../Map/Map";

import PlayerStats from "../Atoms/PlayerStats";
import { Connection, Room } from "../../types/types2";


type RoomDetailsInputProps = {
  id: string;
  onBackgroundImageChange?: (imageUrl: string) => void;
};





const RoomDetails: React.FC<RoomDetailsInputProps> = ({ id, onBackgroundImageChange }) => {
   {console.log("Room")}
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [connections, setConnections] = useState<Connection[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { serializeContext, preparedAction , setRoomId, stamina, setStamina, date } = useGameContext();

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${ApiBaseUrl}/api/Rooms/${id}`);
        if (!response.ok) throw new Error("Failed to fetch room");

        const data = await response.json();
        setRoom({
          ...data,
          connectionsTo: data.connectionsTo || [],
          connectionsFrom: data.connectionsFrom || [],
          items: data.items || [],
          npcs: data.npCs || [],
        });

        if (data.imgUrl && onBackgroundImageChange) {
          onBackgroundImageChange(`${ApiBaseUrl}${data.imgUrl}`);
        }

        
      } catch (error) {
        console.error(error);
        setError("Error fetching room.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);
  useEffect(() => {
    if (!id) return;

    const fetchConnections = async () => {
      setLoading(true);
      setError(null);

      try {
        const gameState = serializeContext(); // Use the memoized function here

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
  }, [id]); 

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${ApiBaseUrl}/api/Rooms`);
        if (!response.ok) throw new Error("Failed to fetch rooms");
  
        const data: Room[] = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
  
    fetchRooms();
  }, []);
  




  const navigateToRoom = (toRoomId: number) => {
    if (stamina < 10) {
   
      setRoomId("1");

    }else{

     
    setRoomId(String(toRoomId));
    }
    setStamina(stamina - 10);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!room) return <div>Room not found.</div>;
console.log("Room", room)
  const roomContent: RoomContentViewerProps["roomContent"] = {
    npCs: (room.npcs ?? []).map((npc) => ({
      npcId: npc.npcId,
      name: npc.name,
      dialogs: npc.dialogs ?? [],
      action: npc.action ? {
        ...npc.action,
        miniGameData: npc.action.miniGameData || "", // Ensuring miniGameData is always a string
      } : null, // Allowing action to be nullable
    })),
    items: (room.items ?? []).map((item) => ({
      itemPositionId: item.itemPositionId,
      roomId: item.roomId,
      x: item.x,
      y: item.y,
      itemId: item.itemId,
      item: item.item ? { ...item.item } : null, // Handling possible null item
    })),
    // Ensure you're passing the triggerActions array here as expected by RoomContentViewerProps
    triggerActions: (room.triggerActions ?? []).map((action) => ({
      actionId: action.actionId,
      description: action.description,
      miniGameData: action.miniGameData, // Just pass the miniGameData as is
      actionTypeId: action.actionTypeId,
    })),
  };
  

const closeAction = () => {
  console.log("Close action");
}
  return (
    <>
      {preparedAction && 
      <ActionForm 
        action={preparedAction.action} 
        source={preparedAction.source} 
        CloseAction={closeAction} 
      />}

      <div className={`${styles.room} ${room.name === "Mapa" ? styles.map : ""}`}>
        <div className={styles.imageContainer}>
          <img className={styles.image} src={`${ApiBaseUrl}${room.imgUrl}`} alt={room.name} />
          {connections?.map(
            (connection) =>
            connection.imgUrl &&
            connection.x !== null &&
            connection.y !== null && (
              <img
                key={connection.toRoomId}
                src={`${ApiBaseUrl}${connection.imgUrl}`}
                alt="Connection"
                className={styles.connection}
                style={{
                  left: `${(connection.x ?? 0) / 10}%`,
                  top: `${(connection.y ?? 0) / 10}%`,
                  width: `${Math.max(20, window.innerWidth * 0.1)}px`, // Scales based on screen size
                  height: "auto",
                }}
                onClick={() => navigateToRoom(connection.toRoomId)}
              />
            )
          )}
        </div>
        <div className={styles.description}>
          <h1>{room.name}</h1>
          <p>{room.text}</p>
          <h2>Items</h2>
          <ul>
            {room.items?.map((item) => (
              <li key={item.itemPositionId}>{item.item ? item.item.name : "Unknown item"}</li>
            ))}
          </ul>
          <div>
            <h2>Player Stats</h2>
            <p><strong>Stamina:</strong> {stamina}</p>
            <p><strong>Date:</strong> {date.toDateString()}</p>
          </div>
          <h2>Room Connections</h2>
          <ul className={styles.connections}>
          {connections?.map((connection) => {
            const targetRoom = rooms.find((r) => r.roomId === connection.toRoomId);

            return (
              <li key={connection.toRoomId}>
                <button
                  className={styles.connectionButton}
                  onClick={() => navigateToRoom(connection.toRoomId)}
                  disabled={!connection.state}
                  title={!connection.state ? "You need certain items to unlock this room." : ""}
                >
                  Prozkoumat {targetRoom ? targetRoom.name : `Room ${connection.toRoomId}`}
                </button>
              </li>
            );
            })}
          </ul>
          <RoomContentViewer roomContent={roomContent} />
          {JSON.stringify(preparedAction)}
        </div>
        <TextEditor />       
        <Checklist />
        <PlayerStats/>
        <div className={room.name === "Mapa" ? styles.mapButton : ""}>
          <Map />
        </div>
      </div>
    </>
  );
};

export default RoomDetails;
