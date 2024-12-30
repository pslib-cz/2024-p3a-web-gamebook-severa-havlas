import { Link, useParams, useNavigate } from "react-router-dom";
import RoomDetail from "../components/MolekuleGetRoom";
import { useContext, useEffect } from "react";
import { GameContext } from "../GameProvider";

const Page = () => {
  const { id: paramId } = useParams<{ id: string }>(); // Extract the `id` from the URL
  const { roomId, setRoomId } = useContext(GameContext); // Access `roomId` and its setter from context
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Update `roomId` in the context whenever `id` changes
  useEffect(() => {
    changeId();
  }, [roomId, setRoomId]);

  const changeId = () => {
     // Update the context
    navigate(`/Page/${roomId}`); // Update the URL dynamically
  };

  return (
    <>
      {roomId ? (
        <RoomDetail id={roomId} /> // Use `roomId` from the context
      ) : (
        <div>Room not found</div>
      )}
      <Link to="/Map">Mapa</Link>
      <Link to="/">Ukončit Hru</Link>
    </>
  );
};

export default Page;
