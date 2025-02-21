import React, { useEffect, useState } from "react";
import { ApiBaseUrl } from "../../EnvFile";
import styles from "./RoomList.module.css";

type Room = {
  roomId: number;
  name: string;
  text: string;
  imgUrl: string;
};

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${ApiBaseUrl}/api/Rooms`);
        if (!response.ok) throw new Error("Failed to fetch rooms");

        const data: Room[] = await response.json();
        setRooms(data);
      } catch (error) {
        console.error(error);
        alert("Error fetching rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>All Rooms</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Room Id</th>
            <th>Name</th>
            <th>Image</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.roomId}>
              <td>{room.roomId}</td>
              <td>{room.name}</td>
              <td>
                <img
                  src={`${ApiBaseUrl}${room.imgUrl}`}
                  alt={room.name}
                />
              </td>
              <td>{room.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomList;
