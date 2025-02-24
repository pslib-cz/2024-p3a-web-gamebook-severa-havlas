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
     
     <main>
      <Link className={styles.admin} to="/Admin">Admin</Link>
     <h1>Název_Gamebooku</h1>
     <h3>Vyřeš tajemství ztracené výpravy</h3>
     <Link className={styles.button} to="/Page/1">Nová hra</Link>
     <Link className={styles.button} to="/register">Registrace</Link>
     <Link className={styles.button} to="/login">Přihlášení</Link>
     <button onClick={HandleButton}>save</button>
     </main>
   </body></> 
  );
}

export default Home;