import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main>
      <h2>Home of</h2>
      <p>kozí hovna</p>
      <Link to="/Admin">mastit si péro</Link>
    </main>
  );
}

export default Home;