import React, { useState } from "react";

const CreateRoom: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!image) {
      alert("Please select an image file.");
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append("Img", image); // Attach the image file
    formData.append("Name", name); // Attach the room name
    formData.append("Text", text); // Attach the room description

    try {
      // Send request to the backend
      const response = await fetch("https://localhost:7058/api/Rooms", {
        method: "POST",
        body: formData, // Send the form data as the body
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Room created successfully:", data);
      alert("Room created successfully!");
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room.");
    }
  };

  return (
    <div>
      <h1>Create a New Room</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Room Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="text">Description:</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Upload Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default CreateRoom;
