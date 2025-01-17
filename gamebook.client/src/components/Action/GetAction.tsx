import React, { useEffect, useState } from "react";

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
const GameBookActionComponent: React.FC<{ id: number }> = ({ id }) => {
  const [gameBookAction, setGameBookAction] = useState<GameBookAction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameBookAction = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://localhost:7058/api/GameBookActions/${id}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: GameBookAction = await response.json();
        setGameBookAction(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameBookAction();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>GameBook Action</h1>
      {gameBookAction && (
        <div>
          <p><strong>Action ID:</strong> {gameBookAction.actionId}</p>
          <p><strong>Description:</strong> {gameBookAction.description}</p>
          <p><strong>Action Type:</strong> {gameBookAction.actionType?.name || "N/A"}</p>
          <p><strong>Required Item:</strong> {gameBookAction.reqItem ?? "None"}</p>
          <p><strong>Required Progress:</strong> {gameBookAction.reqProgress ?? "None"}</p>
          <p><strong>Required NPC:</strong> {gameBookAction.reqNPC ?? "None"}</p>
          <p><strong>Required Action:</strong> {gameBookAction.reqAction ?? "None"}</p>
          <h3>Options:</h3>
          <ul>
            {gameBookAction.options.length > 0 ? (
              gameBookAction.options.map(option => (
                <li key={option.id}>{option.name}</li>
              ))
            ) : (
              <p>No options available.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GameBookActionComponent;
