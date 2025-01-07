import React, { useState } from "react";

interface FormData {
  name: string;
  description: string;
  actionType: string;
  target?: string;
}

const NPCForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    actionType: "",
    target: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch("https://localhost:7058/api/NPCs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          actionTypeId: parseInt(formData.actionType),
          target: formData.target ? parseInt(formData.target) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create NPC");
      }

      setSuccess("NPC created successfully!");
      setFormData({ name: "", description: "", actionType: "", target: "" });
    } catch (err) {
      setError("Failed to create NPC. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="npc-form">
      <h2>Create NPC</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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
          ></textarea>
        </div>

        <div>
          <label htmlFor="actionType">Action Type:</label>
          <input
            type="text"
            id="actionType"
            name="actionType"
            value={formData.actionType}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="target">Target (Optional):</label>
          <input
            type="number"
            id="target"
            name="target"
            value={formData.target}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create NPC"}
        </button>
      </form>
    </div>
  );
};

export default NPCForm;
