import React, { useState } from "react";

const ItemForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gameBookActionId: "", // Regular input for ID
    target: "", // Optional field
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Validation errors

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.gameBookActionId) newErrors.gameBookActionId = "GameBookAction ID is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      gameBookActionId: parseInt(formData.gameBookActionId, 10), // Convert to number
      target: formData.target ? parseInt(formData.target, 10) : null, // Convert to number or keep null
    };

    try {
      const response = await fetch("https://localhost:7058/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to create the item");
      }

      const result = await response.json();
      console.log("Item created:", result);
      alert("Item created successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        gameBookActionId: "",
        target: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating item:", error);
      alert("Failed to create the item. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <h1>Create New Item</h1>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter item name"
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter item description"
        />
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="gameBookActionId">GameBookAction ID</label>
        <input
          id="gameBookActionId"
          name="gameBookActionId"
          value={formData.gameBookActionId}
          onChange={handleChange}
          placeholder="Enter GameBookAction ID"
        />
        {errors.gameBookActionId && <p className="error">{errors.gameBookActionId}</p>}
      </div>

      <div>
        <label htmlFor="target">Target (Optional)</label>
        <input
          id="target"
          name="target"
          value={formData.target}
          onChange={handleChange}
          placeholder="Enter target (if any)"
        />
      </div>

      <button type="submit">Create Item</button>
    </form>
  );
};

export default ItemForm;
