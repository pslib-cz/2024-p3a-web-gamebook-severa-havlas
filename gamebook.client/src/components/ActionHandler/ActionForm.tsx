import React, { useContext } from 'react';
import LightsOutPuzzle from '../Minigames/LightsOutPuzzle';
import LockCombinationPuzzle from '../Minigames/LockPuzzle';
import styles from "./ActionForm.module.css";
// Assuming you have a context defined somewhere in your project
import { GameContext, useGameContext } from '../../GameProvider';
import DarkRoomDetails from '../Room/DarkRoomDetails';

type ActionComponentProps = { 
    action: Action;
    source: string;
  
    CloseAction(): void;
  }
  
  interface Action {
    actionId: number;
    description: string;
    miniGameData: string;
    actionTypeId: number;
  }

  const ActionForm: React.FC<ActionComponentProps> = ({ action, source, CloseAction }) => {
    let ForceSolve: boolean = false;
    let actionContent;
    let isNotOverlay: boolean = false;

    const { previousRoomId, setRoomId, isActionOpen, setIsActionOpen } = useGameContext();

    const CloseActionForm = () => {
        setIsActionOpen(false);
        CloseAction();
    };

    console.log(isActionOpen);

    const handleGoBack = () => {
        if (previousRoomId) {
            console.log(`Navigating back to previous room: ${previousRoomId}`);
            setIsActionOpen(false); // Close overlay first
            
            // Use effect to wait until overlay is closed
            setTimeout(() => {
                setRoomId(previousRoomId);
                CloseAction(); // Ensure this runs after room change
            }, 300); // Slight delay for UI update
        }
    };

    switch (action.actionTypeId) {
        case 1:
            ForceSolve = true;
            actionContent = <LockCombinationPuzzle MinigameData={action.miniGameData} onPuzzleSolved={CloseActionForm} />;
            break;
        case 2:
            ForceSolve = true;
            actionContent = <LightsOutPuzzle onPuzzleSolved={CloseActionForm} />;
            break;
        case 3:
            isNotOverlay = true;
            actionContent = <DarkRoomDetails onExit={CloseActionForm}/>;
            break;
        default:
            actionContent = <div>Unknown Action Type</div>;
            break;
    }

    let background: string = isNotOverlay ? "rgba(0, 0, 0, 0.01)" : "";

    return (
        <> 
            <div className={`${styles.overlay} ${isActionOpen ? styles.open : ""}`} style={{ width: "60%", backgroundColor: background }}>
                <div className={styles.overlayContent}>
                    <h2>Sliding Overlay</h2>
                    <p>asd</p>
                    {actionContent}
                    {JSON.stringify(action)}

                    {previousRoomId && (
                        <button onClick={handleGoBack} className={styles.goBackButton}>
                            Go Back
                        </button>
                    )}

                    <h1>Action Form</h1>
                    
                    {previousRoomId && (
                        <button onClick={handleGoBack}>
                            Go Back
                        </button>
                    )}

                    <button onClick={CloseActionForm}>
                        Close
                    </button>
                </div>
            </div>
        </>
    );
};
export default ActionForm;