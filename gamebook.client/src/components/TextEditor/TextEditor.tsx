import React, { useState } from "react";
import styles from"./TextEditor.module.css";

const TextEditor = () => {
  const [text, setText] = useState(""); // State to store the text
  const [isCollapsed, setIsCollapsed] = useState(false); // State to show/hide editor

  // Handler to update the text
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  // Toggle the collapsed state
  const toggleEditor = () => setIsCollapsed((prev) => !prev);

  return (
    <div className={`${styles.textEditor} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
        <button className={styles.toggleButton} onClick={toggleEditor} disabled={isCollapsed}>
          {isCollapsed ? "→" : "←"}
        </button>

        <div className={styles.editorContent}>
           <h2>Zápisník</h2>
          <textarea
           value={text}
            onChange={handleTextChange}
           placeholder="Type here..."
          />
        </div>
    </div>
  );
};

export default TextEditor;
