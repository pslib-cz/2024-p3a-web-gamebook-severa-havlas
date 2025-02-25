import React, { useState, useContext } from "react";
import BackgroundImage from "../../assets/NoteBlock.webp";
import styles from "./TextEditor.module.css";
import { useGameContext } from "../../GameProvider"; // Ensure this context is correctly set up

const TextEditor = () => {
  const { NoteBookValue, setNoteBookValue } = useGameContext();
  const [text, setText] = useState(NoteBookValue); // Initialize with context value
  const [isClosed, setIsClosed] = useState(true);

  // Update text state when typing
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  // Toggle editor visibility
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
        <h2>Zápisník</h2>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={handleTextChange}
          placeholder="Type here..."
        />
      </div>
    </>
  );
};

export default TextEditor;
