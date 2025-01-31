import React ,{ useState} from "react";
import styles from "./Overlay.module.css";
import LockCombinationPuzzle from "./LockPuzzle";
import { useGameContext } from "../../GameProvider";
import LightsOutPuzzle from "./LightsOutPuzzle";


interface TriggerAction {
  actionId: number;
  description: string;
  miniGameData: string;
  actionTypeId: number;
}

interface SlidingOverlayProps {
  isOpen: boolean;
  overlayWidth?: string;
  triggerActions?: TriggerAction[];
}

type ActionComponentProps = { 
  action: Action;
  source: string;

}

interface Action {
  actionId: number;
  description: string;
  miniGameData: string;
  actionTypeId: number;
}

const renderActionComponent = (
  actionTypeId: number,
  miniGameData: string,
  closeOverlay: () => void
) => {
 
  console.log(`Rendering action component for actionTypeId: ${actionTypeId}`);
  switch (actionTypeId) {
    case 2:
      
      return <LockCombinationPuzzle MinigameData={miniGameData} onPuzzleSolved={closeOverlay} />;

    case 3:
      return <LightsOutPuzzle onPuzzleSolved={closeOverlay} />;
    default:
      return <p>Unsupported action type: {actionTypeId}</p>;
  }
};


const SlidingOverlay: React.FC<SlidingOverlayProps> = ({
  isOpen,
  overlayWidth = "250px",
  triggerActions = [],
}) => {
  const { previousRoomId, setRoomId, setIsOverlayOpen } = useGameContext();

  const closeOverlay = () => setIsOverlayOpen(false);
 
  const handleGoBack = () => {
    if (previousRoomId) {
      console.log(`Navigating back to previous room: ${previousRoomId}`);
      setRoomId(previousRoomId);
      closeOverlay();
    }
  };


  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`} style={{ width: overlayWidth} } >
        <div className={styles.overlayContent}>
          <h2>Sliding Overlay</h2>

          {triggerActions.length > 0 ? (
            triggerActions.map((action) => (
              <div key={action.actionId}>
                <h3>{action.description}</h3>
                {renderActionComponent(action.actionTypeId, action.miniGameData, closeOverlay)}
              </div>
            ))
          ) : (
            <p>No trigger actions available.</p>
          )}

          {previousRoomId && (
            <button onClick={handleGoBack} className={styles.goBackButton}>
              Go Back
            </button>
          )}
        </div>
      </div>

      {isOpen && <div onClick={closeOverlay} className={styles.backdrop} />}
    </>
  );
};

export default SlidingOverlay;
