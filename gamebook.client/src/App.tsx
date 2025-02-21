import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home";
import Admin from "./pages/admin";
import Page from "./pages/page";
import Login from "./pages/Login";
import MolekuleMapViewer from './components/Map/MapViewer';

import GameProvider, { useGameContext } from "./GameProvider";

import { ReactNode } from 'react';
import Register from './pages/Register';

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useGameContext();
  console.log("User in AdminRoute:", user); // Check user in AdminRoute
  return user && user.role === "Admin" ? children : <Navigate to="/login" />;
 
};

const App = () => {
  return (
    <Router>
      <GameProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/Page/:id" element={<Page />} />
          <Route path="/Page/:nodeId" element={<MolekuleMapViewer />} />
        </Routes>
      </GameProvider>
    </Router>
  );
}

export default App;
