import { Link } from "react-router-dom";
import styles from "./admin.module.css";
import Room from "../components/Room/Room";
import Connection from "../components/Connections/Connection";
import { useState } from "react";
import ActionType from "../components/ActionType/ActionType";
import Action from "../components/Action/Action";
import Item from "../components/Item/Item";
import NPCs from "../components/NPC/NPCs";
import Dialog from "../components/Dialog/Dialog";
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
                return <Item />;
            case 'NPC':
                return <NPCs />;
            case 'Dialog':
                return <Dialog />;
            default:
                return <h1>Admin</h1>;
        }
    }

    return (
        <div>
            <nav className={styles.nav}>
                <button className={activeComponent === 'Room' ? styles.active : ''} onClick={() => setActiveComponent('Room')}>Room</button>
                <button className={activeComponent === 'Connection' ? styles.active : ''} onClick={() => setActiveComponent('Connection')}>Connection</button>
                <button className={activeComponent === 'ActionType' ? styles.active : ''} onClick={() => setActiveComponent('ActionType')}>ActionType</button>
                <button className={activeComponent === 'GamebookAction' ? styles.active : ''} onClick={() => setActiveComponent('GamebookAction')}>GamebookAction</button>
                <button className={activeComponent === 'Item' ? styles.active : ''} onClick={() => setActiveComponent('Item')}>Item</button>
                <button className={activeComponent === 'NPC' ? styles.active : ''} onClick={() => setActiveComponent('NPC')}>NPC</button>
                <button className={activeComponent === 'Dialog' ? styles.active : ''} onClick={() => setActiveComponent('Dialog')}>Dialog</button>
                <Link className={styles.exit} to="/">Konec</Link>
            </nav>
            <div>{active()}</div>
        </div>
    );

}

export default Admin;