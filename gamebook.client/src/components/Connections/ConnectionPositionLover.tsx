import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiBaseUrl } from "../../EnvFile";
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
  const [roomDimensions, setRoomDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const fetchRoomData = async (data: { roomId: number }) => {
    const { roomId } = data;

    try {
      // Fetch room image
      const roomImageResponse = await fetch(`${ApiBaseUrl}/api/rooms/${roomId}/image`);
      if (!roomImageResponse.ok) {
        throw new Error("Failed to fetch room image");
      }
      const roomImageBlob = await roomImageResponse.blob();
      const imageUrl = URL.createObjectURL(roomImageBlob);
      setRoomImage(imageUrl);

      // Fetch connections
      const connectionsResponse = await fetch(`${ApiBaseUrl}/api/connections/${roomId}/GetFromConnection`);
      if (!connectionsResponse.ok) {
        throw new Error("Failed to fetch connections");
      }
      const connectionsData: Connection[] = await connectionsResponse.json();
      setConnections(connectionsData);

      // Set room dimensions (assuming you know the room width and height, or you fetch them)
      setRoomDimensions({ width: 800, height: 600 }); // Use actual dimensions
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

  const submitPositions = async () => {
    const scaledConnections = connections.map((connection) => ({
      connectionId: connection.connectionId,
      x: Math.round((connection.x / roomDimensions.width) * 1000), // Scale to 0-1000 and round to integer
      y: Math.round((connection.y / roomDimensions.height) * 1000), // Scale to 0-1000 and round to integer
    }));
  
    try {
      const response = await fetch(`${ApiBaseUrl}/api/Rooms/Connections`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scaledConnections),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit positions");
      }
  
      alert("Positions submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting positions");
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
            src={{ApiBaseUrl} + connection.imgUrl}
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

      <button onClick={submitPositions} style={{ marginTop: "20px" }}>
        Submit Positions
      </button>
    </div>
  );
};

export default RoomConnectionForm;
