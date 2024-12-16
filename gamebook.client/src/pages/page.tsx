import { Link } from "react-router-dom";
import RoomsList from "../queries/GetRooms";

const Page = () => {
  return (
    <main>
      <h2>This is a</h2>
      <p>Page</p>
      <Link to="/">home</Link>
      <RoomsList />
    </main>
  );
}

export default Page;