import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import mapImage from "../../assets/Map.webp";
import styles from "./Map.module.css";
import { ApiBaseUrl } from "../../EnvFile";

type Room = {
  roomId: number;
  name: string;
};

const Map = () => {
  const [mapRoomId, setMapRoomId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all rooms
        const response = await fetch(`${ApiBaseUrl}/api/Rooms`);
        if (!response.ok) throw new Error("Failed to fetch rooms.");

        const rooms: Room[] = await response.json();

        // Find the room where name === "Map"
        const mapRoom = rooms.find((room) => room.name === "Mapa");

        if (!mapRoom) {
          throw new Error("Map room not found.");
        }

        setMapRoomId(mapRoom.roomId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchMapRoom();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main>
      {mapRoomId ? (
        <Link className={styles.link} to={`/Page/${mapRoomId}`}>
          <img className={styles.image} src={mapImage} alt="Mapa" />
        </Link>
      ) : (
        <div>Map room not found.</div>
      )}
    </main>
  );
};

export default Map;
