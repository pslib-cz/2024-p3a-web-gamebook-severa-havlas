import React, { useState } from "react";

const CreateNPCForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    actionTypeId: "",
    actionName: "",
    target: "",
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Ensure required fields are filled
    if (!formData.name || !formData.description || !formData.actionTypeId || !formData.actionName) {
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    try {
      const npcPayload = {
        name: formData.name,
        description: formData.description,
        action: {
          actionTypeId: parseInt(formData.actionTypeId, 10), // Ensure it's a number
          name: formData.actionName,
        },
        target: formData.target ? parseInt(formData.target, 10) : null, // Optional target
      };

      const response = await fetch("https://localhost:7058/api/NPCs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(npcPayload),
      });

      if (response.ok) {
        const npc = await response.json();
        setStatusMessage(`NPC "${npc.name}" created successfully!`);
        setFormData({
          name: "",
          description: "",
          actionTypeId: "",
          actionName: "",
          target: "",
        });
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.message || "Failed to create NPC."}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatusMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Create NPC</h2>
      {statusMessage && <p>{statusMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name (Required):
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description (Required):
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            ActionTypeId (Required):
            <input
              type="number"
              name="actionTypeId"
              value={formData.actionTypeId}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Action Name (Required):
            <input
              type="text"
              name="actionName"
              value={formData.actionName}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Target (Optional):
            <input
              type="number"
              name="target"
              value={formData.target}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="submit">Create NPC</button>
      </form>
    </div>
  );
};

export default CreateNPCForm;
