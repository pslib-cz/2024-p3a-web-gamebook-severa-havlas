import { Link, useParams } from "react-router-dom";
import RoomDetail from "../components/MolekuleGetRoom";

const Page = () => {
  const { id } = useParams<{ id: string }>(); // Extract the `id` from the route

  return (
    <>
      {id ? <RoomDetail id={id} /> : <div>Room not found</div>} {/* Render RoomDetail if id exists */}
      <Link to="/Map">Mapa</Link>
      <Link to="/">Ukončit Hru</Link>
    </>
  );
};

export default Page;

