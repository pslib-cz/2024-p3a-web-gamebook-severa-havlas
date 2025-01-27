import React, { useState } from "react";

const RoomRequirementsForm: React.FC = () => {
  const [roomId, setRoomId] = useState<string>(""); // Room ID as input
  const [requiredItems, setRequiredItems] = useState<string>(""); // Comma-separated IDs
  const [requiredNPCs, setRequiredNPCs] = useState<string>(""); // Comma-separated IDs
  const [requiredActions, setRequiredActions] = useState<string>(""); // Comma-separated IDs

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!roomId.trim()) {
      setError("Room ID is required.");
      return;
    }

    // Prepare the payload
    const payload = {
      RequiredItems: requiredItems
        ? requiredItems.split(",").map((id) => parseInt(id.trim()))
        : [],
      RequiredNPCs: requiredNPCs
        ? requiredNPCs.split(",").map((id) => parseInt(id.trim()))
        : [],
      RequiredActions: requiredActions
        ? requiredActions.split(",").map((id) => parseInt(id.trim()))
        : [],
    };

    try {
      const response = await fetch(
        `https://localhost:7058/api/Connections/${roomId}/UpdateRequirements`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error: ${response.status} - ${errorMessage}`);
      }

      setMessage("Room requirements updated successfully!");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <h1>Update Room Requirements</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="roomIdInput">Room ID:</label>
          <input
            type="text"
            id="roomIdInput"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter the Room ID"
          />
        </div>

        <div>
          <label htmlFor="requiredItemsInput">Required Items (comma-separated IDs):</label>
          <input
            type="text"
            id="requiredItemsInput"
            value={requiredItems}
            onChange={(e) => setRequiredItems(e.target.value)}
            placeholder="e.g., 1, 2, 3"
          />
        </div>

        <div>
          <label htmlFor="requiredNPCsInput">Required NPCs (comma-separated IDs):</label>
          <input
            type="text"
            id="requiredNPCsInput"
            value={requiredNPCs}
            onChange={(e) => setRequiredNPCs(e.target.value)}
            placeholder="e.g., 4, 5, 6"
          />
        </div>

        <div>
          <label htmlFor="requiredActionsInput">Required Actions (comma-separated IDs):</label>
          <input
            type="text"
            id="requiredActionsInput"
            value={requiredActions}
            onChange={(e) => setRequiredActions(e.target.value)}
            placeholder="e.g., 7, 8, 9"
          />
        </div>

        <button type="submit">Update Room</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RoomRequirementsForm;
