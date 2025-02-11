import React, { useState, useEffect } from "react";
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
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);
  const [roomDimensions, setRoomDimensions] = useState<{ width: number; height: number }>({
    width: 800, // Default width
    height: 600, // Default height
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedConnectionId === null) return;

      const movement = 1;
      setConnections((prevConnections) => {
        return prevConnections.map((conn) =>
          conn.connectionId === selectedConnectionId
            ? {
                ...conn,
                x: event.key === "ArrowLeft" ? conn.x - movement : event.key === "ArrowRight" ? conn.x + movement : conn.x,
                y: event.key === "ArrowUp" ? conn.y - movement : event.key === "ArrowDown" ? conn.y + movement : conn.y,
              }
            : conn
        );
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedConnectionId]);

  const fetchRoomData = async (data: { roomId: number }) => {
    const { roomId } = data;

    try {
      const roomImageResponse = await fetch(`${ApiBaseUrl}/api/rooms/${roomId}/image`);
      if (!roomImageResponse.ok) throw new Error("Failed to fetch room image");
      const roomImageBlob = await roomImageResponse.blob();
      setRoomImage(URL.createObjectURL(roomImageBlob));

      const connectionsResponse = await fetch(`${ApiBaseUrl}/api/connections/${roomId}/GetFromConnection`);
      if (!connectionsResponse.ok) throw new Error("Failed to fetch connections");
      const connectionsData: Connection[] = await connectionsResponse.json();

      console.log("Fetched raw connections:", connectionsData);

      const adjustedConnections = connectionsData.map((conn) => ({
        ...conn,
        x: Math.round((conn.x / 1000) * roomDimensions.width),
        y: Math.round((conn.y / 1000) * roomDimensions.height),
      }));

      console.log("Adjusted fetched connections:", adjustedConnections);
      setConnections(adjustedConnections);
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching data");
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLImageElement>, connection: Connection) => {
    setDraggingConnection(connection);
    setSelectedConnectionId(connection.connectionId);
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

      setConnections((prevConnections) => {
        const updatedConnections = prevConnections.map((conn) =>
          conn.connectionId === draggingConnection.connectionId
            ? { ...conn, x: offsetX, y: offsetY }
            : conn
        );
        console.log("Updated connections after drag:", updatedConnections);
        return updatedConnections;
      });

      setDraggingConnection(null);
    }
  };

  const submitPositions = async () => {
    const scaledConnections = connections.map((connection) => ({
      connectionId: connection.connectionId,
      x: Math.round((connection.x / roomDimensions.width) * 1000),
      y: Math.round((connection.y / roomDimensions.height) * 1000),
    }));

    console.log("Submitting positions:", scaledConnections);

    try {
      const response = await fetch(`${ApiBaseUrl}/api/Rooms/Connections`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scaledConnections),
      });

      if (!response.ok) throw new Error("Failed to submit positions");
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
        <input id="roomId" {...register("roomId", { required: true })} type="number" placeholder="Enter Room ID" />
        <button type="submit">Fetch Room Data</button>
      </form>

      <div
        style={{ width: "800px", height: "600px", position: "relative", border: "1px solid black", marginTop: "20px" }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {roomImage && <img src={roomImage} alt="Room" style={{ width: "100%", height: "100%", position: "absolute", left: "0px", right: "0px" }} />}
        {connections.map((connection) => (
          <img
            key={connection.connectionId}
            src={`${ApiBaseUrl}${connection.imgUrl}`}
            alt={`Connection ${connection.connectionId}`}
            draggable
            onDragStart={(event) => handleDragStart(event, connection)}
            onClick={() => setSelectedConnectionId(connection.connectionId)}
            style={{
              position: "absolute",
              left: `${connection.x}px`,
              top: `${connection.y}px`,
              width: "50px",
              height: "50px",
              cursor: "grab",
              border: selectedConnectionId === connection.connectionId ? "2px solid red" : "none",
            }}
          />
        ))}
      </div>

      <button onClick={submitPositions} style={{ marginTop: "20px" }}>Submit Positions</button>
    </div>
  );
};

export default RoomConnectionForm;
