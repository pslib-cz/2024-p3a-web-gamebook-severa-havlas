import React, { useState } from "react";
import BackgroundImage from "../../assets/NoteBlock.webp";
import styles from"./TextEditor.module.css";

const TextEditor = () => {
  const [text, setText] = useState(""); // State to store the text
  const [isClosed, setIsClosed] = useState(true); // State to show/hide editor

  // Handler to update the text
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  // Toggle the collapsed state
  const toggleEditor = () => setIsClosed((prev) => !prev);

  return (
    <>
        <button className={styles.toggleButton} onClick={toggleEditor}>
           <img className={styles.image} src={BackgroundImage} alt="Text Editor" />
        </button>

        <div className={`${styles.editorContent} ${isClosed ? styles.closed : styles.expanded}`}>
          <h2>Zápisník</h2>
          <textarea className={styles.textarea} value={text} onChange={handleTextChange} placeholder="Type here..." />
        </div>
    </>
  );
};

export default TextEditor;
