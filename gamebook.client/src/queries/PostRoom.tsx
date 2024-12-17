
import React, { useState, useEffect } from 'react';
export type RoomDTO = {


  name: string;
  text: string;
  imgBase64: string;
}


const PostRoomEffect = (RoomDTO: RoomDTO) => {
  const roomData = {
    name: "Enchanted Library",
    text: "A magical room filled with ancient books and secrets.",
    imgBase64: "iVBORw0KGgoAAAANSUhEUgAAAAUA..." // Replace with valid Base64 image data
  };
  const [triggerPost, setTriggerPost] = useState(false); // State to control the useEffect trigger
  useEffect(() => {
    const postRoom = async () => {
      try {
        const response = await fetch("https://localhost:7068/api/Rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(roomData), // Send the RoomDTO data
        });

        if (!response.ok) {
          throw new Error(`Failed to create room: ${response.status}`);
        }

        const result = await response.json();
        console.log("Room created successfully:", result);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error posting room:", error.message);
        } else {
          console.error("Error posting room:", error);
        }
      }
    };

    // Call the postRoom function when the component mounts
    if (triggerPost) {
      postRoom();
      setTriggerPost(false); // Reset the trigger after posting
    }
  }, [triggerPost]); // Empty dependency array to run only on component mount
  const handleButtonClick = () => {
    setTriggerPost(true); // Set the trigger to true on button click
  };
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Post Room</h1>
      <p>Click the button to post a new room to the API.</p>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleButtonClick}
      >
        Create Room
      </button>
    </div>
  );
};

export default PostRoomEffect;
