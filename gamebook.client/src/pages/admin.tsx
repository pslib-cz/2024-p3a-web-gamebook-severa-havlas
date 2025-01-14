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
import UpdateOptions from "../components/MolekulePatchActionOptions";
import PostOption from "../components/MolekulePostOption";
import FetchOptions from "../components/MolekulePatchOptions";
import PostDialogForm from "../components/MolekulePostDialog";
const Admin = () => {

   

 

    return (
        <>
            <p>admin tu</p>
            <Link to="/">ahoj</Link>
           
           
        <CreateRoom />
        <RoomList />
        
        
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
        <UpdateOptions />
        <PostOption />
        <FetchOptions />
        <PostDialogForm />
        </>
    );

}

export default Admin;