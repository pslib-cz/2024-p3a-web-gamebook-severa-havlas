import { Link } from "react-router-dom";
import GetRoom from "../queries/GetRooms";

import { useState } from "react";
import RoomManager from "../components/RoomManager";
import GetRooms from "../queries/GetRooms";
import PostConnection from "../components/molekulePostConnection";

const Admin = () => {
 
    const [mrdka, setMrdka] = useState<boolean>(false);

    const handleClick = () => {
        
        setMrdka(true);
      };

    return (
        <>
            <p>admin tu</p>
            <Link to="/">ahoj</Link>
           
           
      
        <RoomManager />
        <GetRooms />
        <PostConnection />
     
        </>
    );

}

export default Admin;