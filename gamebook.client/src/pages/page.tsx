import { Link } from "react-router-dom";
import RoomDetails from "../components/Room/GetRoom";
import { useGameContext } from "../GameProvider";
import styles from "./page.module.css";

const Page = () => {
  const { roomId } = useGameContext();


  return (
    <div className={styles.page}>
      
      {roomId ? (
        <RoomDetails id={roomId} />
      ) : (
        <div>Room not found</div>
      )}
      <Link className={styles.link} to="/">Ukončit Hru</Link>
    </div>
  );
};

export default Page;
