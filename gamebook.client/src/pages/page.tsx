import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import RoomDetail from "../components/OrgasmGetRoom";
import { useContext } from "react";
import { useGameContext } from '../GameProvider';
import TextEditor from "../components/MolekuleNoteBlock";
import ObraDinnTable from "../components/MolekuleTable";
import JigsawPuzzle from "../components/MolekuleJigsawPuzzle";
import LightsOutPuzzle from "../components/MolekuleLightsOutPuzzle";
import LockCombinationPuzzle from "../components/MolekuleLockPuzzle";
import GraphComponent from "../components/MolekuleMapViewer";

const Page = () => {
  const { id } = useParams();
  const { roomId, setRoomId } = useGameContext();

  useEffect(() => {
    setRoomId(id ?? null);
  }, [id, setRoomId]);

  return (
    <>
      {roomId ? (
        <RoomDetail id={roomId} /> // Use `roomId` from the context
      ) : (
        <div>Room not found</div>
      )}
  <TextEditor />
  <ObraDinnTable />
  <JigsawPuzzle />
  <LightsOutPuzzle />
  
  <LockCombinationPuzzle numberOfDials={9} maxDialValue={9} />
      <Link to="/Map">Mapa</Link>
      <Link to="/">Ukončit Hru</Link>
    </>
  );
};

export default Page;
