import { Link } from "react-router-dom";
import GetRoom from "../queries/GetRooms";

import { useState } from "react";
import RoomManager from "../components/RoomManager";
import MolekulePostRoomForm from "../components/MolekulePostRoomForm";
import PostRoomEffect, { RoomDTO } from "../queries/PostRoom";
const Admin = () => {
  const roomData:RoomDTO = {
    name: "Enchanted Library",
    text: "A magical room filled with ancient books and secrets.",
    imgBase64: "iVBORw0KGgoAAAANSUhEUgAAAAUA..." // Replace with valid Base64 image data
  };
    const [mrdka, setMrdka] = useState<boolean>(false);

    const handleClick = () => {
        
        setMrdka(true);
      };

    return (
        <>
            <p>admin tu</p>
            <Link to="/">domastil sem</Link>
           
           
      
        <RoomManager />
      <PostRoomEffect name={roomData.name} text={roomData.text} imgBase64={roomData.imgBase64} />
     
        </>
    );

}

export default Admin;