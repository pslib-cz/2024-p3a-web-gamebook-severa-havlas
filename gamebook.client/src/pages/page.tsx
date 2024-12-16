import { Link } from "react-router-dom";
import RoomDetail from "../queries/GetRoom";


const Page = () => {
  return (
    <>
      <RoomDetail />
      <Link to="/Map">Mapa</Link>
      <Link to="/">Ukončit Hru</Link>
    </>
  );
}

export default Page;