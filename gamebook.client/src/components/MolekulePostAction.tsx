import React, { useState } from "react";

interface Option {
  label: string;
  text: string;
  actionId?: string; // Representing the next GameBookAction (Action)
}

interface GameBookActionCreateDto {
  actionTypeId: number;
  options: Option[];
  reqItem?: number;
  reqProgress?: number;
  reqNPC?: number;
  description: string;
  reqAction?: number;
}

const CreateGameBookAction: React.FC = () => {
  const [formData, setFormData] = useState<GameBookActionCreateDto>({
    actionTypeId: 0,
    options: [],
    reqItem: undefined,
    reqProgress: undefined,
    reqNPC: undefined,
    description: "",
    reqAction: undefined,
  });

  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "actionTypeId" || name === "reqItem" || name === "reqProgress" || name === "reqNPC" || name === "reqAction"
        ? Number(value)
        : value,
    }));
  };

  const handleAddOption = () => {
    setFormData((prevState) => ({
      ...prevState,
      options: [...prevState.options, { label: "", text: "", actionId: undefined }],
    }));
  };

  const handleOptionChange = (
    index: number,
    field: "label" | "text" | "actionId",
    value: string | number
  ) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setFormData((prevState) => ({ ...prevState, options: updatedOptions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setResponseMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("https://localhost:7058/api/GameBookActions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.message || "An error occurred while creating the GameBookAction.");
        return;
      }

      const result = await response.json();
      setResponseMessage("GameBookAction created successfully!");
    } catch (error) {
      setErrorMessage("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Create GameBookAction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ActionTypeId:</label>
          <input
            type="number"
            name="actionTypeId"
            value={formData.actionTypeId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>ReqItem:</label>
          <input
            type="number"
            name="reqItem"
            value={formData.reqItem || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>ReqProgress:</label>
          <input
            type="number"
            name="reqProgress"
            value={formData.reqProgress || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>ReqNPC:</label>
          <input
            type="number"
            name="reqNPC"
            value={formData.reqNPC || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>ReqAction:</label>
          <input
            type="number"
            name="reqAction"
            value={formData.reqAction || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <h3>Options</h3>
          {formData.options.map((option, index) => (
            <div key={index} style={{ marginBottom: "1em", border: "1px solid #ccc", padding: "1em" }}>
              <input
                type="text"
                placeholder="Label"
                value={option.label}
                onChange={(e) =>
                  handleOptionChange(index, "label", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Text"
                value={option.text}
                onChange={(e) =>
                  handleOptionChange(index, "text", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Next ActionId (optional)"
                value={option.actionId || ""}
                onChange={(e) =>
                  handleOptionChange(index, "actionId", e.target.value)
                }
              />
            </div>
          ))}
          <button type="button" onClick={handleAddOption}>
            Add Option
          </button>
        </div>
        <button type="submit">Create GameBookAction</button>
      </form>
      {responseMessage && <p style={{ color: "green" }}>{responseMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default CreateGameBookAction;
