import { Link } from "react-router-dom";
import GetRoom from "../queries/GetRooms";

import { useState } from "react";
import RoomManager from "../components/RoomManager";
import MolekulePostRoomForm from "../components/MolekulePostRoomForm";
const Admin = () => {
    
    const [mrdka, setMrdka] = useState<boolean>(false);

    const handleClick = () => {
        
        setMrdka(true);
      };

    return (
        <>
            <p>admin tu</p>
            <Link to="/">domastil sem</Link>
           
           
      
        <RoomManager />

     
        </>
    );

}

export default Admin;