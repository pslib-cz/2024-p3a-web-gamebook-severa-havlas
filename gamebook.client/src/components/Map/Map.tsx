import { Link } from "react-router-dom";
import mapImage from "../../assets/Map.webp";
import styles from "./Map.module.css";

const Map = () => {
  return (
    <>
      <main>
        <Link className={styles.link} to="/Page/8">
          <img className={styles.image} src={mapImage} alt="Mapa" />
        </Link>
      </main>
    </>
  );
}

export default Map;