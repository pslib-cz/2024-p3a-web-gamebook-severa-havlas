import { Link } from "react-router-dom";
import styles from  "./Home.module.css";
import { useGameContext } from "../GameProvider";
const Home = () => {

const {saveUserData} = useGameContext();
const HandleButton = () => {
  saveUserData(); 

}
;
  return (
    <>
      <body className={styles.body}> 
          <Link className={styles.admin} to="/Admin">Admin</Link>
          <h1 className={styles.h1}>Poslední stopa</h1>
          <h3 className={styles.h3}>Vyřeš tajemství ztracené výpravy</h3>
          <div className={styles.navigation}>
            <Link className={styles.button} to="/Page/1">Nová hra</Link>
            <Link className={styles.button} to="/register">Registrace</Link>
            <Link className={styles.button} to="/login">Přihlášení</Link>
            <button className={styles.button} onClick={HandleButton}>Uložit</button>
          </div>
      </body>
    </> 
  );
}

export default Home;