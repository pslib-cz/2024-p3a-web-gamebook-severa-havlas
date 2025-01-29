import React, { useState } from "react";
import { ApiBaseUrl } from "../../EnvFile";
interface CreateItemDTO {
  RoomId: number;
  ItemId: number;
  X: number;
  Y: number;
}

const CreateItemPosition: React.FC = () => {
  const [formData, setFormData] = useState<CreateItemDTO>({
    RoomId: 0,
    ItemId: 0,
    X: 0,
    Y: 0,
  });
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value, 10), // Parse numeric values
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ApiBaseUrl}/api/ItemPositions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(`ItemPosition created successfully with ID: ${data.itemPositionId}`);
        setFormData({ RoomId: 0, ItemId: 0, X: 0, Y: 0 }); // Reset form
      } else {
        const errorData = await response.json();
        setResponseMessage(`Error: ${errorData.message || "Failed to create ItemPosition"}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h1>Create Item Position</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="RoomId">Room ID:</label>
          <input
            type="number"
            id="RoomId"
            name="RoomId"
            value={formData.RoomId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="ItemId">Item ID:</label>
          <input
            type="number"
            id="ItemId"
            name="ItemId"
            value={formData.ItemId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="X">X Position:</label>
          <input
            type="number"
            id="X"
            name="X"
            value={formData.X}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Y">Y Position:</label>
          <input
            type="number"
            id="Y"
            name="Y"
            value={formData.Y}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default CreateItemPosition;
