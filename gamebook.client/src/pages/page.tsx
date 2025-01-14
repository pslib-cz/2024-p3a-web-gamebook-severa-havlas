import React from "react";
import { Link, useParams } from "react-router-dom";
import RoomDetails from "../components/OrgasmGetRoom";
import { useGameContext } from "../GameProvider";
import TextEditor from "../components/TextEditor/TextEditor";
import Map from "../components/MolekuleMap";
import styles from "./page.module.css";

const Page = () => {
  const { id } = useParams(); // Room ID from the URL
  const { roomId, setRoomId } = useGameContext();


  return (
    <div className={styles.page}>
      {roomId ? (
        <RoomDetails id={roomId} />
      ) : (
        <div>Room not found</div>
      )}
      <TextEditor />
      <Map />
      <Link className={styles.link} to="/">Ukončit Hru</Link>
    </div>
  );
};

export default Page;
