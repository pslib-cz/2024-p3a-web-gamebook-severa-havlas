import { Link } from "react-router-dom";
import CreateNPCForm from "../components/NPC/PostNPC";
import ItemForm from "../components/Item/PostItem";
import PostDialogForm from "../components/Dialog/MolekulePostDialog";
import styles from "./admin.module.css";
import Room from "../components/Room/Room";
import Connection from "../components/Connections/Connection";
import { useState } from "react";
import ActionType from "../components/ActionType/ActionType";
import Action from "../components/Action/Action";
const Admin = () => {
    const [activeComponent, setActiveComponent] = useState('');

    const active = () => {
        switch (activeComponent) {
            case 'Room':
                return <Room />;
            case 'Connection':
                return <Connection />;
            case 'ActionType':
                return <ActionType />;
            case 'GamebookAction':
                return <Action />;
            case 'Item':
                return <ItemForm />;
            case 'NPC':
                return <CreateNPCForm />;
            case 'Dialog':
                return <PostDialogForm />;
            default:
                return <h1>Admin</h1>;
        }
    }

    return (
        <div>
            <nav>
                <button onClick={() => setActiveComponent('Room')}>Room</button>
                <button onClick={() => setActiveComponent('Connection')}>Connection</button>
                <button onClick={() => setActiveComponent('ActionType')}>ActionType</button>
                <button onClick={() => setActiveComponent('GamebookAction')}>GamebookAction</button>
                <button onClick={() => setActiveComponent('Item')}>Item</button>
                <button onClick={() => setActiveComponent('NPC')}>NPC</button>
                <button onClick={() => setActiveComponent('Dialog')}>Dialog</button>
            </nav>
            <div>{active()}</div>
            {/* 
            <div>
                <button>Item</button>
                <ItemForm />
                <ItemsList />
                <PlayerItems/>
            </div>
            <div>
                <button>NPC</button>
                <CreateNPCForm />
            </div>
            <div>
                <button>Dialog</button>
                <PostDialogForm />
            </div> */}
            <Link className={styles.exit} to="/">Konec</Link>
        </div>
    );

}

export default Admin;