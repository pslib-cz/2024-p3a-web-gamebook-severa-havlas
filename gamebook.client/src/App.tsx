import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Importuj RouterProvider
import Home from "./pages/Home";
import Admin from "./pages/admin";
import Page from "./pages/page";
import Map from "./pages/Map";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/Admin",
    element: <Admin />,
  },
  {
    path: "/Page/:id", // Dynamic route for rooms
    element: <Page />,
  },
  {
    path: "/Map",
    element: <Map />,
  },
]);


const App = () => {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
