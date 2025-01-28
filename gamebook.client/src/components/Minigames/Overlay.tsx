import React from "react";
import "./SlidingOverlay.css";
import LockCombinationPuzzle from "./LockPuzzle"; // Import the lock puzzle component
import { useGameContext } from "../../GameProvider"; // Import GameContext to access room navigation

interface TriggerAction {
  actionId: number;
  description: string;
  miniGameData: string;
  actionTypeId: number;
}

interface SlidingOverlayProps {
  isOpen: boolean; // Control overlay visibility
  overlayWidth?: string; // Control overlay width
  onClose?: () => void; // Function to close the overlay
  triggerActions?: TriggerAction[]; // Array of trigger actions
}

const renderActionComponent = (
  actionTypeId: number,
  miniGameData: string,
  onClose?: () => void
) => {
  console.log(`Rendering action component for actionTypeId: ${actionTypeId}`);
  switch (actionTypeId) {
    case 2:
      console.log("Rendering LockCombinationPuzzle...");
      return (
        <LockCombinationPuzzle MinigameData={miniGameData} onPuzzleSolved={onClose} />
      );
    default:
      console.log("Unsupported action type:", actionTypeId);
      return <p>Unsupported action type: {actionTypeId}</p>;
  }
};

const SlidingOverlay: React.FC<SlidingOverlayProps> = ({
  isOpen,
  overlayWidth = "250px",
  onClose,
  triggerActions = [],
}) => {
  const { previousRoomId, setRoomId } = useGameContext(); // Access previousRoomId and setRoomId from context

  const handleGoBack = () => {
    if (previousRoomId) {
      console.log(`Navigating back to previous room: ${previousRoomId}`);
      setRoomId(previousRoomId); // Navigate to the previous room
      onClose?.(); // Close the overlay
    } else {
      console.log("No previous room available to navigate back to.");
    }
  };

  console.log("SlidingOverlay isOpen:", isOpen);
  return (
    <>
      <div
        className={`overlay ${isOpen ? "open" : ""}`}
        style={{ width: overlayWidth }}
      >
        <div className="overlay-content">
          <h2>Sliding Overlay</h2>

          {triggerActions.length > 0 ? (
            <div>
              {triggerActions.map((action) => (
                <div key={action.actionId}>
                  <h3>{action.description}</h3>
                  {renderActionComponent(action.actionTypeId, action.miniGameData, onClose)}
                </div>
              ))}
            </div>
          ) : (
            <p>No trigger actions available.</p>
          )}

          {/* "Go Back" Button */}
          {previousRoomId && (
            <button onClick={handleGoBack} className="go-back-button">
              Go Back
            </button>
          )}
        </div>
      </div>

      {isOpen && onClose && <div onClick={onClose} className="backdrop" />}
    </>
  );
};

export default SlidingOverlay;
