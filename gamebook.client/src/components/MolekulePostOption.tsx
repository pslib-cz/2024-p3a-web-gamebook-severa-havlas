import React, { useState } from "react";

interface Option {
  label: string;
  text: string;
  actionId?: number; // Optional if ActionId is not mandatory
}

const PostOption: React.FC = () => {
  const [option, setOption] = useState<Option>({ label: "", text: "", actionId: undefined });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOption((prevOption) => ({
      ...prevOption,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (!option.label || !option.text) {
      setError("Label and Text are required.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7058/api/GameBookActions/Options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(option),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("An option with this label already exists.");
        }
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create the option.");
      }

      const data = await response.json();
      setMessage(`Option created successfully: ${data.label}`);
      setError(null);
      setOption({ label: "", text: "", actionId: undefined }); // Reset form
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setMessage(null);
    }
  };

  return (
    <div>
      <h1>Create a New Option</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Label:
            <input
              type="text"
              name="label"
              value={option.label}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Text:
            <input
              type="text"
              name="text"
              value={option.text}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Action ID (Optional):
            <input
              type="number"
              name="actionId"
              value={option.actionId || ""}
              onChange={(e) =>
                setOption((prevOption) => ({
                  ...prevOption,
                  actionId: Number(e.target.value),
                }))
              }
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostOption;
