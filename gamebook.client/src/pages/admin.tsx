import { Link } from "react-router-dom";

import CreateRoom from "../components/MolekulePostRoomForm";
import RoomList from "../components/MolekuleGetRooms";
import RoomDetails from "../components/MolekuleGetRoom";


import PostConnection from "../components/molekulePostConnection";

const Admin = () => {
 
   

 

    return (
        <>
            <p>admin tu</p>
            <Link to="/">ahoj</Link>
           
           
        <CreateRoom />
        <RoomList />
        <RoomDetails />
        <PostConnection />
     
        </>
    );

}

export default Admin;