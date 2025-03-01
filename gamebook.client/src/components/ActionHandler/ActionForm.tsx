import React, { useContext, useEffect } from 'react';
import LightsOutPuzzle from '../Minigames/LightsOutPuzzle';
import LockCombinationPuzzle from '../Minigames/LockPuzzle';
import styles from "./ActionForm.module.css";
// Assuming you have a context defined somewhere in your project
import {  useGameContext } from '../../GameProvider';
import DarkRoomDetails from '../Room/DarkRoomDetails';
import Shop from '../Action/ShopAction';
import { GameBookAction } from '../../types/types2';
import TexasHoldEm from '../Action/Poker';
import Work from '../Action/Work';
import Sacrificer from '../Action/Sacrificer';
import DialogAction from '../Action/DialogAction';
import Heal from '../Action/Heal';
import Pray from '../Action/Pray';
type ActionComponentProps = { 
    action: GameBookAction;
    source: string;
  
    CloseAction(): void;
  }
  
 

  const ActionForm: React.FC<ActionComponentProps> = ({ action, source, CloseAction }) => {
    let ForceSolve: boolean = false;
    let actionContent;
    let isNotOverlay: boolean = false;
    let isOnceADay: boolean = false;
    const { previousRoomId, setRoomId, isActionOpen, setIsActionOpen } = useGameContext();

    const CloseActionForm = () => {
        setIsActionOpen(false);
        CloseAction();
    };

 

    
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
            actionContent = <DialogAction action={action} source={source} CloseAction={CloseAction}></DialogAction> //netestovaný
            break;
        case 2:
            ForceSolve = true;
            if (isActionOpen) {
            actionContent = <LockCombinationPuzzle MinigameData={action.miniGameData} onPuzzleSolved={CloseActionForm} />;}
            break;
        case 3:
            ForceSolve = true;
            if (isActionOpen) {
            actionContent = <LightsOutPuzzle onPuzzleSolved={CloseActionForm} />;}
            break;
        case 4:
            isNotOverlay = true;
            if (isActionOpen) {
                actionContent = <DarkRoomDetails onExit={CloseActionForm}/>;}//netestovaný
            break;

        case 5:
            //Implementováno v inventáři, tady je to voser
            break;
        case 6:
            actionContent = <Shop/>;
            break;
            case 7:
                if(isActionOpen){
                    isOnceADay = true;
                    actionContent = <TexasHoldEm/>;
                }
            break;
         
            case 8:
                isOnceADay = true;
                actionContent = <Heal/> //netestovaný
            break;
            case 9:
                isOnceADay = true;
                isNotOverlay = true;
                actionContent = <Work/>
                break;

                case 10:
                    isOnceADay = true;
                    actionContent = <Sacrificer/>
                break;
              case 11:
                isOnceADay = true;
                actionContent = <Pray/> //netestovaný
                break;
        default:
            actionContent = <div>Unknown Action Type</div>;
            break;
    }

    let background: string = isNotOverlay ? "rgba(0, 0, 0, 0.01)" : "";

    return (
        <> 
            <div className={`${styles.overlay} ${isActionOpen ? styles.open : ""}`}>
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

                    <button className={styles.closeButton} onClick={CloseActionForm}>
                        Close
                    </button>
                </div>
            </div>
        </>
    );
};
export default ActionForm;