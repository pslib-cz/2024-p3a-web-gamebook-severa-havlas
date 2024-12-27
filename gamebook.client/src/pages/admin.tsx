import { Link } from "react-router-dom";
import React, { useState } from 'react';
import CreateRoom from "../components/MolekulePostRoomForm";
import RoomList from "../components/MolekuleGetRooms";
import RoomDetails from "../components/MolekuleGetRoom";


import PostConnection from "../components/MolekulePostConnection";
import AtomForm from "../components/AtomForm";
import MolekuleGetConnections from "../components/MolekuleGetConectionList";

const Admin = () => {
 const [Id, setId] = useState<string>('');
   

 

    return (
        <>
            <p>admin tu</p>
            <Link to="/">ahoj</Link>
           
           
        <CreateRoom />
        <RoomList />
        <AtomForm onSubmit={(value) => setId(value)} />
        <RoomDetails id={Id}/>
        <PostConnection />
        <MolekuleGetConnections />
        </>
    );

}

export default Admin;