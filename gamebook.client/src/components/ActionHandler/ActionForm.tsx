import React, { useContext } from 'react';
import LightsOutPuzzle from '../Minigames/LightsOutPuzzle';
import LockCombinationPuzzle from '../Minigames/LockPuzzle';
import styles from "./ActionForm.module.css";
// Assuming you have a context defined somewhere in your project
import { GameContext, useGameContext } from '../../GameProvider';

type ActionComponentProps = { 
    action: Action;
    source: string;
    isopen: boolean;
    CloseAction(): void;
  }
  
  interface Action {
    actionId: number;
    description: string;
    miniGameData: string;
    actionTypeId: number;
  }

const ActionForm: React.FC<ActionComponentProps> = ({ action, source, isopen, CloseAction }) => {
    let ForceSolve: boolean = false;
    let actionContent;
     const { previousRoomId, setRoomId, setIsOverlayOpen } = useGameContext();

    const CloseActionForm = () => {
        CloseAction();
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
            //actionContent = <Sleep description={action.description} />;
            break;
        default:
            actionContent = <div>Unknown Action Type</div>;
            break;
    }


    
    const handleGoBack = () => {
        if (previousRoomId) {
          console.log(`Navigating back to previous room: ${previousRoomId}`);
          setRoomId(previousRoomId);
          CloseActionForm();
        }
      };
    const { preparedAction } = useContext(GameContext);
      let overlayWidth = "60%";
    return (
       <> 
            
            <div className={`${styles.overlay} ${isopen ? styles.open : ""}`} style={{ width: overlayWidth} } >
                <div className={styles.overlayContent}>
                    <h2>Sliding Overlay</h2>

                    
                        {actionContent}
                    

                    {previousRoomId && (
                        <button onClick={handleGoBack} className={styles.goBackButton}>
                        Go Back
                        </button>
                    )}
                </div>
            </div>
                <h1>Action Form</h1>
            
                
                    {previousRoomId && ForceSolve && (
                        <button onClick={handleGoBack}>
                        Go Back
                        </button>
                    )}

                    {!ForceSolve && (
                        <button onClick={CloseActionForm}>
                        close
                        </button>
                    )}
            

        </>
    );
};

export default ActionForm;