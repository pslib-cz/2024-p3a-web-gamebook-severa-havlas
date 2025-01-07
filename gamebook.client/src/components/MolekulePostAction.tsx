import React, { useState } from "react";

// Define the types for GameBookAction and related properties
interface ActionType {
  id: number;
  name: string; // Adjust this according to your actual ActionType model
}

interface Option {
  id: number; // Adjust this according to your actual Option model
  name: string; // Example field
}

interface GameBookAction {
  actionId: number;
  actionTypeId: number;
  actionType: ActionType;
  options: Option[];
  reqItem?: number;
  reqProgress?: number;
  reqNPC?: number;
  description: string;
  reqAction?: number;
}

// Component
const AddGameBookActionForm: React.FC = () => {
  const [newAction, setNewAction] = useState<Omit<GameBookAction, 'actionId'>>({
    actionTypeId: 0,
    actionType: { id: 0, name: "" },
    options: [],
    reqItem: undefined,
    reqProgress: undefined,
    reqNPC: undefined,
    description: "",
    reqAction: undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddAction = async () => {
    try {
      const response = await fetch(`https://localhost:7058/api/GameBookActions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAction),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const createdAction: GameBookAction = await response.json();
      setSuccessMessage(`Action with ID ${createdAction.actionId} successfully created!`);
      setError(null);
      // Reset the form
      setNewAction({
        actionTypeId: 0,
        actionType: { id: 0, name: "" },
        options: [],
        reqItem: undefined,
        reqProgress: undefined,
        reqNPC: undefined,
        description: "",
        reqAction: undefined,
      });
    } catch (err: any) {
      setError(err.message);
      setSuccessMessage(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAction((prevAction) => ({
      ...prevAction,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>Add New GameBook Action</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddAction();
        }}
      >
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={newAction.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Action Type ID:</label>
          <input
            type="number"
            name="actionTypeId"
            value={newAction.actionTypeId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Required Item:</label>
          <input
            type="number"
            name="reqItem"
            value={newAction.reqItem ?? ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Required Progress:</label>
          <input
            type="number"
            name="reqProgress"
            value={newAction.reqProgress ?? ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Required NPC:</label>
          <input
            type="number"
            name="reqNPC"
            value={newAction.reqNPC ?? ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Required Action:</label>
          <input
            type="number"
            name="reqAction"
            value={newAction.reqAction ?? ""}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Add Action</button>
      </form>
    </div>
  );
};

export default AddGameBookActionForm;
