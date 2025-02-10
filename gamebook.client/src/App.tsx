import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Admin from "./pages/admin";
import Page from "./pages/page";
import MolekuleMapViewer from './components/Map/MapViewer';
import GameProvider from "./GameProvider";

const App = () => {
  return (
    <Router>
      <GameProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Page/:id" element={<Page />} />
          <Route path="/Page/:nodeId" element={<MolekuleMapViewer />} />
        </Routes>
      </GameProvider>
    </Router>
  );
}

export default App;
