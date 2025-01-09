import React, { useState } from "react";

interface Option {
  label: string;
  text: string;
  actionId?: number;
}

interface UpdateOptionsDTO {
  actionId: number;
  options: Option[];
}

const UpdateOptions: React.FC = () => {
  const [actionId, setActionId] = useState<number>(0);
  const [options, setOptions] = useState<Option[]>([{ label: "", text: "" }]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (actionId <= 0 || options.some((o) => !o.label || !o.text)) {
      setError("Action ID and options are required.");
      return;
    }

    const updateData: UpdateOptionsDTO = {
      actionId,
      options,
    };

    try {
      const response = await fetch("https://localhost:7058/api/GameBookActions/UpdateOptions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update options.");
      }

      const data = await response.json();
      setMessage("Options updated successfully!");
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setMessage(null);
    }
  };

  const handleOptionChange = (index: number, key: keyof Option, value: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((option, i) =>
        i === index ? { ...option, [key]: value } : option
      )
    );
  };

  const addOption = () => {
    setOptions((prevOptions) => [...prevOptions, { label: "", text: "" }]);
  };

  const removeOption = (index: number) => {
    setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1>Update Options for GameBookAction</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Action ID:
            <input
              type="number"
              value={actionId}
              onChange={(e) => setActionId(Number(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <h2>Options</h2>
          {options.map((option, index) => (
            <div key={index}>
              <label>
                Label:
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) =>
                    handleOptionChange(index, "label", e.target.value)
                  }
                  required
                />
              </label>
              <label>
                Text:
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(index, "text", e.target.value)
                  }
                  required
                />
              </label>
              <button type="button" onClick={() => removeOption(index)}>
                Remove Option
              </button>
            </div>
          ))}
          <button type="button" onClick={addOption}>
            Add Option
          </button>
        </div>
        <button type="submit">Update Options</button>
      </form>
    </div>
  );
};

export default UpdateOptions;
