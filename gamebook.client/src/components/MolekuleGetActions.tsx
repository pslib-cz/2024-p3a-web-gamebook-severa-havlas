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
const GameBookActionsComponent: React.FC = () => {
  const [gameBookActions, setGameBookActions] = useState<GameBookAction[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameBookActions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://localhost:7058/api/GameBookActions`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: GameBookAction[] = await response.json();
        setGameBookActions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameBookActions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>GameBook Actions</h1>
      {gameBookActions && gameBookActions.length > 0 ? (
        <ul>
          {gameBookActions.map((action) => (
            <li key={action.actionId}>
              <p><strong>Action ID:</strong> {action.actionId}</p>
              <p><strong>Description:</strong> {action.description}</p>
              <p><strong>Action Type:</strong> {action.actionType?.name || "N/A"}</p>
              <p><strong>Required Item:</strong> {action.reqItem ?? "None"}</p>
              <p><strong>Required Progress:</strong> {action.reqProgress ?? "None"}</p>
              <p><strong>Required NPC:</strong> {action.reqNPC ?? "None"}</p>
              <p><strong>Required Action:</strong> {action.reqAction ?? "None"}</p>
              <h3>Options:</h3>
              <ul>
              
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No actions available.</p>
      )}
    </div>
  );
};

export default GameBookActionsComponent;
