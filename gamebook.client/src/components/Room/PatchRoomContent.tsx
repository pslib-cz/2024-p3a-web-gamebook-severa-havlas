import React, { useState } from "react";
import { ApiBaseUrl } from "../../EnvFile";
const UpdateRoomContentForm: React.FC = () => {
  const [roomId, setRoomId] = useState<string>(""); // Room ID as string for input
  const [npcs, setNpcs] = useState<string>(""); // Input for NPC IDs (comma-separated)
  const [triggerActions, setTriggerActions] = useState<string>(""); // Input for TriggerAction IDs (comma-separated)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the payload
    const payload = {
      NPCs: npcs ? npcs.split(",").map((id) => parseInt(id.trim())) : null,
      TriggerActions: triggerActions
        ? triggerActions.split(",").map((id) => parseInt(id.trim()))
        : null,
    };

    try {
      const response = await fetch(`${ApiBaseUrl}/api/Rooms/${roomId}/updateRoomContent`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Room content updated successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to update room content."}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Room Content</h2>

      {/* Room ID Input */}
      <div>
        <label htmlFor="roomId">Room ID:</label>
        <input
          type="text"
          id="roomId"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
        />
      </div>

      {/* NPC IDs Input */}
      <div>
        <label htmlFor="npcs">NPC IDs (comma-separated):</label>
        <input
          type="text"
          id="npcs"
          value={npcs}
          onChange={(e) => setNpcs(e.target.value)}
        />
      </div>

      {/* TriggerAction IDs Input */}
      <div>
        <label htmlFor="triggerActions">Trigger Action IDs (comma-separated):</label>
        <input
          type="text"
          id="triggerActions"
          value={triggerActions}
          onChange={(e) => setTriggerActions(e.target.value)}
        />
      </div>

      <button type="submit">Update Room Content</button>
    </form>
  );
};

export default UpdateRoomContentForm;
