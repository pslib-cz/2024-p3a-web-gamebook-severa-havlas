import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import RoomDetails from "../components/OrgasmGetRoom";
import { useGameContext } from "../GameProvider";
import TextEditor from "../components/TextEditor/TextEditor";
import Checklist from "../components/Checklist/Checklist";
import JigsawPuzzle from "../components/MolekuleJigsawPuzzle";
import LightsOutPuzzle from "../components/MolekuleLightsOutPuzzle";
import LockCombinationPuzzle from "../components/MolekuleLockPuzzle";
import styles from "./page.module.css";

const Page = () => {
  const { id } = useParams();
  const { roomId, setRoomId } = useGameContext();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRoomId(id ?? null);
  }, [id, setRoomId]);

  const handleBackgroundImageChange = (imageUrl: string) => {
    if (pageRef.current) {
      pageRef.current.style.setProperty("--background-url", `url(${imageUrl})`);
    }
  };

  return (
    <div ref={pageRef} className={styles.page} data-background>
      {roomId ? (
        <RoomDetails id={roomId} onBackgroundImageChange={handleBackgroundImageChange} />
      ) : (
        <div>Room not found</div>
      )}
      <TextEditor />
      <Checklist />
      <JigsawPuzzle />
      <LightsOutPuzzle />
      <LockCombinationPuzzle numberOfDials={9} maxDialValue={9} />
      <Link to="/">Ukončit Hru</Link>
    </div>
  );
};

export default Page;
