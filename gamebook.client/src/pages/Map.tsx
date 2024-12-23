import { Link } from "react-router-dom";

const Map = () => {
  return (
    <main>
      <h2>Mapa</h2>
      <p>Právě koukáš na mapu. Vyber jaké místo chceš navštívit</p>
      <Link to="/">Ukončit Hru</Link>
      <Link to="/Page/1">Doky</Link>
      <Link to="/Page/2">Kostel</Link>
      <Link to="/Page/6">Room 1</Link>
    </main>
  );
}

export default Map;