import React, { useState } from 'react';
import { useGameContext } from '../../GameProvider';
import styles from './PlayerStats.module.css';
import BackgroundImage from '../../assets/Stats.webp';
import { Item } from '../../types/types2';
import { ApiBaseUrl } from '../../EnvFile';

const PlayerStats: React.FC = () => {
    const { player, stamina, money, NoteBookValue, setNoteBookValue } = useGameContext();
    const [text, setText] = useState(NoteBookValue);
    const [isClosed, setIsClosed] = useState(true);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const toggleEditor = () => {
        if (!isClosed) {
            setNoteBookValue(text);
        } else {
            setText(NoteBookValue);
        }
        setIsClosed((prev) => !prev);
    };

    const inspectItem = (item: Item) => {
        console.log(item.imgUrl);
        

        setSelectedItem(item.imgUrl ?? null);
        console.log(`${ApiBaseUrl}${selectedItem}`);
    };

    const closeInspection = () => {
       
        setSelectedItem(null);
    };

    return (
        <>
            <button className={styles.toggleButton} onClick={toggleEditor}>
                <img className={styles.image} src={BackgroundImage} alt="Text Editor" />
            </button>

            <div className={`${styles.editorContent} ${isClosed ? styles.closed : styles.expanded}`}>
                <h2>Player Stats</h2>
                <div>
                    <strong>Items:</strong>
                    <ul>
                        {player.items.map((item) => (
                            <li key={item.itemId}>
                                {item.name}: {item.quantity} {item.description}
                                {/* <button onClick={() => inspectItem(item)}>Inspect</button> */}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <strong>Stamina:</strong> {stamina}
                </div>
                <div>
                    <strong>Money:</strong> {money}
                </div>
            </div>

            {selectedItem && (
                <div className={styles.overlay} onClick={closeInspection}>
               
                    <img className={styles.largeImage} src={`${ApiBaseUrl}${selectedItem}`} alt="Inspected Item" />
                </div>
            )}
        </>
    );
};

export default PlayerStats;
