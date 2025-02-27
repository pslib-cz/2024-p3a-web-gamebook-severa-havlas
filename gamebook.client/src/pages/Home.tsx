import { Link, useNavigate } from "react-router-dom";
import styles from  "./Home.module.css";
import { useGameContext } from "../GameProvider";

const Home = () => {
 
  const navigate = useNavigate();
    const { previousRoomId,roomId,money, setMoney, setRoomId, setPlayerItems,setStamina,  setDate, setPreparedAction, setIsActionOpen, setNoteBookValue } = useGameContext();

 
 



  const HandleContinue = () => { 
  
    navigate(`/page/${previousRoomId}`)

  }

  const HandleNewGame = () => {

    setRoomId("1");
    setPlayerItems(() => []);
   
    
    setStamina(100);
    setDate(new Date(1849, 1, 3));
    setPreparedAction(null);
    setIsActionOpen(false);
    setNoteBookValue("");
    setMoney(250);

    navigate(`/page/1`)

  }
  const {saveUserData} = useGameContext();
  const HandleButton = () => {
    saveUserData(); 

  }

    return (
      <>
        <body className={styles.body}> 
            <Link className={styles.admin} to="/Admin">Admin</Link>
            <h1 className={styles.h1}>Poslední stopa</h1>
            <h3 className={styles.h3}>Vyřeš tajemství ztracené výpravy</h3>
            <div className={styles.navigation}>
              <button className={styles.button} onClick={HandleNewGame} >Nová hra</button>
              <button className={styles.button} onClick={HandleContinue}>Pokračovat</button>
              <Link className={styles.button} to="/register">Registrace</Link>
              <Link className={styles.button} to="/login">Přihlášení</Link>
              <button className={styles.button} onClick={HandleButton}>Uložit</button>
            </div>
        </body>
      </> 
    );
}

export default Home;