import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Connection {
  connectionId: number;
  x: number;
  y: number;
  toRoomId: number;
  fromRoomId: number;
  imgUrl: string;
}

interface FormData {
  roomId: number;
}

const RoomConnectionForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [draggingConnection, setDraggingConnection] = useState<Connection | null>(null);

  const fetchRoomData = async (data: { roomId: number }) => {
    const { roomId } = data;

    try {
      // Fetch room image
      const roomImageResponse = await fetch(`https://localhost:7058/api/rooms/${roomId}/image`);
      if (!roomImageResponse.ok) {
        throw new Error("Failed to fetch room image");
      }
      const roomImageBlob = await roomImageResponse.blob();
      setRoomImage(URL.createObjectURL(roomImageBlob));

      // Fetch connections
      const connectionsResponse = await fetch(`https://localhost:7058/api/connections/${roomId}/GetFromConnection`);
      if (!connectionsResponse.ok) {
        throw new Error("Failed to fetch connections");
      }
      const connectionsData: Connection[] = await connectionsResponse.json();
      setConnections(connectionsData);
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching data");
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLImageElement>, connection: Connection) => {
    setDraggingConnection(connection);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (draggingConnection) {
      const rect = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      setConnections((prevConnections) =>
        prevConnections.map((conn) =>
          conn.connectionId === draggingConnection.connectionId
            ? { ...conn, x: offsetX, y: offsetY }
            : conn
        )
      );

      setDraggingConnection(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(fetchRoomData)}>
        <label htmlFor="roomId">RoomId:</label>
        <input
          id="roomId"
          {...register("roomId", { required: true })}
          type="number"
          placeholder="Enter Room ID"
        />
        <button type="submit">Fetch Room Data</button>
      </form>

      <div
        style={{
          width: "800px",
          height: "600px",
          position: "relative",
          border: "1px solid black",
          marginTop: "20px",
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {roomImage && (
          <img
            src={roomImage}
            alt="Room"
            style={{ width: "100%", height: "100%", position: "absolute" }}
          />
        )}

        {connections.map((connection) => (
          <img
            key={connection.connectionId}
            src={"https://localhost:7058"+ connection.imgUrl}
            alt={`Connection ${connection.connectionId}`}
            draggable
            onDragStart={(event) => handleDragStart(event, connection)}
            style={{
              position: "absolute",
              left: connection.x,
              top: connection.y,
              width: "50px",
              height: "50px",
              cursor: "grab",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomConnectionForm;
