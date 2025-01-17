import React, { useEffect, useState } from "react";

interface Option {
  label: string;
  text: string;
  actionId?: number;
}

interface GameBookAction {
  actionId: number;
  actionTypeId: number;
  options: Option[];
  reqItem?: number;
  reqProgress?: number;
  reqNPC?: number;
  description: string;
  reqAction?: number;
}

const GetAllActions: React.FC = () => {
  const [actions, setActions] = useState<GameBookAction[] | null>(null); // Allow null for the initial state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://localhost:7058/api/GameBookActions"); // Replace with your API endpoint

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to fetch actions.");
        }

        const data: GameBookAction[] = await response.json();

        // Ensure the response is valid before setting state
        setActions(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching actions.");
        setActions(null); // Set actions to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []); // Empty dependency array ensures this runs once when the component mounts.

  return (
    <div>
      <h1>All GameBook Actions</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && actions && actions.length > 0 && (
        <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ActionId</th>
              <th>ActionTypeId</th>
              <th>Description</th>
              <th>ReqItem</th>
              <th>ReqProgress</th>
              <th>ReqNPC</th>
              <th>ReqAction</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action) => (
              <tr key={action.actionId || Math.random()}>
                <td>{action.actionId || "N/A"}</td>
                <td>{action.actionTypeId || "N/A"}</td>
                <td>{action.description || "No description available"}</td>
                <td>{action.reqItem ?? "N/A"}</td>
                <td>{action.reqProgress ?? "N/A"}</td>
                <td>{action.reqNPC ?? "N/A"}</td>
                <td>{action.reqAction ?? "N/A"}</td>
                <td>
                  {action.options && action.options.length > 0 ? (
                    <ul>
                      {action.options.map((option, index) => (
                        <li key={index}>
                          <strong>Label:</strong> {option.label || "N/A"},{" "}
                          <strong>Text:</strong> {option.text || "N/A"},{" "}
                          <strong>Next ActionId:</strong>{" "}
                          {option.actionId ?? "N/A"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No options available"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && actions && actions.length === 0 && (
        <p>No actions found.</p>
      )}
    </div>
  );
};

export default GetAllActions;
