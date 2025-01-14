import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import RoomDetails from "../components/OrgasmGetRoom";
import { useGameContext } from "../GameProvider";
import TextEditor from "../components/TextEditor/TextEditor";
import Checklist from "../components/Checklist/Checklist";
import Map from "../components/MolekuleMap";
import styles from "./page.module.css";

const Page = () => {
  const { id } = useParams();
  const { roomId, setRoomId } = useGameContext();

  useEffect(() => {
    setRoomId(id ?? null);
  }, [id, setRoomId]);


  return (
    <div className={styles.page}>
      {roomId ? (
        <RoomDetails id={roomId} />
      ) : (
        <div>Room not found</div>
      )}
      <TextEditor />
      <Checklist />
      <Map />
      <Link className={styles.link} to="/">Ukončit Hru</Link>
    </div>
  );
};

export default Page;
