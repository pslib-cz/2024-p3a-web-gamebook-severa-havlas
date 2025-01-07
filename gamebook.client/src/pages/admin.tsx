import { Link } from "react-router-dom";
import React, { useState } from 'react';
import CreateRoom from "../components/MolekulePostRoomForm";
import RoomList from "../components/MolekuleGetRooms";
import RoomDetails from "../components/OrgasmGetRoom";
import CreateNPCForm from "../components/MolekulePostNPC";


import PostConnection from "../components/MolekulePostConnection";
import AtomForm from "../components/AtomForm";
import MolekuleGetConnections from "../components/MolekuleGetConectionList";
import ItemForm from "../components/MolekulePostItem";
import ActionTypeForm from "../components/MolekulePostActionType";
import {ActionTypeList} from "../components/MolekuleGetActionTypes";
import { PlayerItems } from "../components/MolekulePlayerItems";
import RoomRequirementsForm from "../components/MolekulePatchRequireds";
import ItemsList from "../components/MolekuleGetItems";
import UpdateRoomContentForm from "../components/MolekulePatchRoomContent";
import GraphComponent from "../components/MolekuleMapViewer";
import GameBookActionsComponent from "../components/MolekuleGetActions";
import GameBookActionsPostComponent from "../components/MolekulePostAction";
const Admin = () => {
 const [Id, setId] = useState<string>('1');
   

 

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
        <ItemForm />
        <ActionTypeForm/>
        <ActionTypeList />
        <PlayerItems/>
        <RoomRequirementsForm />
        <ItemsList />
        <UpdateRoomContentForm />
        <GraphComponent />
        <CreateNPCForm />
        <GameBookActionsComponent />
        <GameBookActionsPostComponent />
        </>
    );

}

export default Admin;