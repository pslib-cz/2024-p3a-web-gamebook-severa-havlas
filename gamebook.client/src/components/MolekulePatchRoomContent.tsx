import React, { useState } from "react";
import { ItemPosition } from "../types/types"; // Importing your type

const UpdateRoomContentForm: React.FC = () => {
  const [roomId, setRoomId] = useState<string>(""); // Room ID as string for input
  const [npcs, setNpcs] = useState<string>(""); // Input for NPC IDs (comma-separated)
  const [items, setItems] = useState<string>(""); // Input for Item IDs (comma-separated)
  const [itemPositions, setItemPositions] = useState<ItemPosition[]>([]); // Using your ItemPosition type

  // Add a new item position
  const addItemPosition = (itemPosition: ItemPosition) => {
    setItemPositions((prev) => [...prev, itemPosition]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the payload
    const payload = {
      NPCs: npcs ? npcs.split(",").map((id) => parseInt(id.trim())) : null,
      Items: items ? items.split(",").map((id) => parseInt(id.trim())) : null,
      ItemPositions: itemPositions.length > 0 ? itemPositions : null,
    };

    try {
      const response = await fetch(`https://localhost:7058/api/Rooms/${roomId}/updateRoomContent`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Room content updated successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to update room content."}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Room Content</h2>

      {/* Room ID Input */}
      <div>
        <label htmlFor="roomId">Room ID:</label>
        <input
          type="text"
          id="roomId"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
        />
      </div>

      {/* NPC IDs Input */}
      <div>
        <label htmlFor="npcs">NPC IDs (comma-separated):</label>
        <input
          type="text"
          id="npcs"
          value={npcs}
          onChange={(e) => setNpcs(e.target.value)}
        />
      </div>

      {/* Item IDs Input */}
      <div>
        <label htmlFor="items">Item IDs (comma-separated):</label>
        <input
          type="text"
          id="items"
          value={items}
          onChange={(e) => setItems(e.target.value)}
        />
      </div>

      {/* Item Positions Input */}
      <div>
        <h4>Item Positions:</h4>
        <ItemPositionsInput addItemPosition={addItemPosition} />
        <ul>
          {itemPositions.map((pos, index) => (
            <li key={index}>
              X: {pos.x}, Y: {pos.y}, Item ID: {pos.itemId}
            </li>
          ))}
        </ul>
      </div>

      <button type="submit">Update Room Content</button>
    </form>
  );
};

// Component for adding item positions
interface ItemPositionsInputProps {
  addItemPosition: (itemPosition: ItemPosition) => void;
}

const ItemPositionsInput: React.FC<ItemPositionsInputProps> = ({ addItemPosition }) => {
  const [x, setX] = useState<number | "">("");
  const [y, setY] = useState<number | "">("");
  const [itemId, setItemId] = useState<number | "">("");

  const handleAdd = () => {
    if (x !== "" && y !== "" && itemId !== "") {
      addItemPosition({ x: Number(x), y: Number(y), itemId: Number(itemId) });
      setX("");
      setY("");
      setItemId("");
    } else {
      alert("Please fill out all fields for Item Position.");
    }
  };

  return (
    <div>
      <label>X:</label>
      <input
        type="number"
        value={x}
        onChange={(e) => setX(Number(e.target.value))}
        step="0.01"
      />
      <label>Y:</label>
      <input
        type="number"
        value={y}
        onChange={(e) => setY(Number(e.target.value))}
        step="0.01"
      />
      <label>Item ID:</label>
      <input
        type="number"
        value={itemId}
        onChange={(e) => setItemId(Number(e.target.value))}
      />
      <button type="button" onClick={handleAdd}>
        Add Item Position
      </button>
    </div>
  );
};

export default UpdateRoomContentForm;
