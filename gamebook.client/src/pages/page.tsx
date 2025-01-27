import React from "react";
import { Link } from "react-router-dom";
import RoomDetails from "../components/Room/GetRoom";
import { useGameContext } from "../GameProvider";
import TextEditor from "../components/Atoms/TextEditor";
import Map from "../components/Map/Map";
import styles from "./page.module.css";
import Checklist from "../components/Atoms/Checklist";

const Page = () => {
  const { roomId } = useGameContext();


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
