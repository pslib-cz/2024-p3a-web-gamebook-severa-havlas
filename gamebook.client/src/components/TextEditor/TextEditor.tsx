import React, { useState } from "react";
import styles from"./TextEditor.module.css";

const TextEditor = () => {
  const [text, setText] = useState(""); // State to store the text
  const [bold, setBold] = useState(false); // Bold state
  const [italic, setItalic] = useState(false); // Italic state
  const [underline, setUnderline] = useState(false); // Underline state
  const [isCollapsed, setIsCollapsed] = useState(false); // State to show/hide editor

  // Handler to update the text
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  // Toggle formatting styles
  const toggleBold = () => setBold((prev) => !prev);
  const toggleItalic = () => setItalic((prev) => !prev);
  const toggleUnderline = () => setUnderline((prev) => !prev);

  // Calculate the applied styles
  const getStyle = () => {
    const style: React.CSSProperties = {};
    if (bold) style.fontWeight = "bold";
    if (italic) style.fontStyle = "italic";
    if (underline) style.textDecoration = "underline";
    return style;
  };

  // Toggle the collapsed state
  const toggleEditor = () => setIsCollapsed((prev) => !prev);

  return (
    <div className={`${styles.textEditor} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
        <button className={styles.toggleButton} onClick={toggleEditor} disabled={isCollapsed}>
          {isCollapsed ? "→" : "←"}
        </button>

        <div className={styles.editorContent}>
           <h2>Simple Text Editor</h2>
           <div className={styles.toolbar}>
             <button onClick={toggleBold} className={bold ? styles.active : ""}>
                Bold
              </button>
             <button onClick={toggleItalic} className={italic ? styles.active : ""}>
               Italic
             </button>
              <button onClick={toggleUnderline} className={underline ? styles.active : ""}>
                Underline             </button>
          </div>
          <textarea
           value={text}
            onChange={handleTextChange}
            style={getStyle()}
           placeholder="Type here..."
          />
        </div>
    </div>
  );
};

export default TextEditor;
