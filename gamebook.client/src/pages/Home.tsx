import { Link } from "react-router-dom";
import styles from  "./Home.module.css";

const Home = () => {
  return (
    <body className={styles.body}>
      <main>
       <Link className={styles.admin} to="/Admin">Admin</Link>
        {/* <Link to="/Gamebook">Přihlásit</Link>
      <Link to="/Gamebook">Registrovat</Link> */}
      <h1>Název_Gamebooku</h1>
      <h3>Vyřeš tajemství ztracené výpravy</h3>
      <Link className={styles.button} to="/Page/1">Nová hra</Link>
      </main>
    </body>
  );
}

export default Home;