import React, { useContext, useState } from 'react';
import { useGameContext } from '../../GameProvider';
import styles from './/PlayerStats.module.css';
import BackgroundImage from '../../assets/NoteBlock.webp';

// Assuming you have a context that provides PlayerItems and stamina

const PlayerStats: React.FC = () => {
    const { player, stamina } = useGameContext();

      const { NoteBookValue, setNoteBookValue } = useGameContext();
      const [text, setText] = useState(NoteBookValue); // Initialize with context value
      const [isClosed, setIsClosed] = useState(true);
    

    const toggleEditor = () => {
        if (!isClosed) {
          setNoteBookValue(text); // Save text to context when closing
        } else {
          setText(NoteBookValue); // Load text from context when opening
        }
        setIsClosed((prev) => !prev);
      };

    return (
        <>
            <button className={styles.toggleButton} onClick={toggleEditor}>
                <img className={styles.image} src={BackgroundImage} alt="Text Editor" />
            </button>

            <div className={`${styles.editorContent} ${isClosed ? styles.closed : styles.expanded}`}>
                <h2>Player Stats</h2>
                <div>
                    <strong>Items:</strong> {player.items.join(', ')}
                </div>
                <div>
                    <strong>Stamina:</strong> {stamina}
                </div>
            </div>
        </>
    );
};

export default PlayerStats;