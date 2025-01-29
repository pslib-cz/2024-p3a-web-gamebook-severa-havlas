import React, { useState } from "react";
import { ApiBaseUrl } from "../../EnvFile";
interface GameBookActionCreateDto {
  actionTypeId: number;
  description: string;
  miniGameData: string; // New field for mini-game data
}

const CreateGameBookAction: React.FC = () => {
  const [formData, setFormData] = useState<GameBookActionCreateDto>({
    actionTypeId: 0,
    description: "",
    miniGameData: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "actionTypeId" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${ApiBaseUrl}/api/GameBookActions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "An error occurred while creating the action.");
      }

      setSuccessMessage("GameBookAction created successfully!");
      setFormData({ actionTypeId: 0, description: "", miniGameData: "" });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h1>Create GameBook Action</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="actionTypeId">Action Type ID:</label>
          <input
            type="number"
            id="actionTypeId"
            name="actionTypeId"
            value={formData.actionTypeId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="miniGameData">Mini-Game Data:</label>
          <textarea
            id="miniGameData"
            name="miniGameData"
            value={formData.miniGameData}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Action</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default CreateGameBookAction;
