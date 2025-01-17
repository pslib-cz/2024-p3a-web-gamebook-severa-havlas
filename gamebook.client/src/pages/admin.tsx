import { Link } from "react-router-dom";
import React, { useState } from 'react';
import CreateRoom from "../components/Room/PostRoomForm";
import RoomList from "../components/Room/GetRooms";
import RoomDetails from "../components/Room/GetRoom";
import CreateNPCForm from "../components/NPC/PostNPC";


import PostConnection from "../components/Connections/PostConnection";
import AtomForm from "../components/AtomForm";
import MolekuleGetConnections from "../components/Connections/GetConectionList";
import ItemForm from "../components/Item/PostItem";
import ActionTypeForm from "../components/ActionType/PostActionType";
import {ActionTypeList} from "../components/ActionType/GetActionTypes";
import { PlayerItems } from "../components/Item/PlayerItems";
import RoomRequirementsForm from "../components/Requireds/PatchRequireds";
import ItemsList from "../components/Item/GetItems";
import UpdateRoomContentForm from "../components/Room/PatchRoomContent";
import GraphComponent from "../components/Map/MapViewer";
import GameBookActionsComponent from "../components/Action/GetActions";
import GameBookActionsPostComponent from "../components/Action/PostAction";
import PostDialogForm from "../components/Dialog/MolekulePostDialog";
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
        <PostDialogForm />
        </>
    );

}

export default Admin;