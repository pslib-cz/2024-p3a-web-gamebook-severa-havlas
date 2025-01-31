import React, { useContext } from 'react';
import LightsOutPuzzle from '../Minigames/LightsOutPuzzle';
import LockCombinationPuzzle from '../Minigames/LockPuzzle';
import styles from "./ActionForm.module.css";
// Assuming you have a context defined somewhere in your project
import { GameContext, useGameContext } from '../../GameProvider';

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

const ActionForm: React.FC<ActionComponentProps> = ({ action, source,  CloseAction }) => {
    let ForceSolve: boolean = false;
    let actionContent;
    let isNotOverlay: boolean  = false;
     const { previousRoomId, setRoomId, setIsOverlayOpen } = useGameContext();
    const [isopen, setIsOpen] = React.useState(true);
    const CloseActionForm = () => {
        setIsOpen(false);
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
            isNotOverlay = true;
            actionContent = <div>Unknown Action Type</div>;
            break;
        default:
            actionContent = <div>Unknown Action Type</div>;
            break;
    }

    let background: string = "";
    if(isNotOverlay){
        background = "rgba(0, 0, 0, 0.01)";
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
            
            <div className={`${styles.overlay} ${isopen ? styles.open : ""}`} style={{ width: overlayWidth, backgroundColor: background } } >
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
                </div>
            </div>
               
            

        </>
    );
};

export default ActionForm;