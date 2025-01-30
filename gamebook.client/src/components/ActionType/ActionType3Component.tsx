import React, { useState } from "react";
import { useGameContext } from "../../GameProvider";
import "./ActionType3Component.css"; // Import CSS for animations

import DarkRoomDetails from "../Room/DarkRoomDetails";

interface Action {
    actionId: number;
    description: string;
    actionTypeId: number;
}

const ActionType3Component: React.FC<{ action: Action }> = ({ action }) => {
   //const { stamina, date, setStamina, setDate } = useGameContext();
    const [isFading, setIsFading] = useState(false);
    const [showDarkRoom, setShowDarkRoom] = useState(false);
    const [isBlackout, setIsBlackout] = useState(false);

    const handleAction = () => {
        setIsFading(true);
        setIsBlackout(true);
      

       setTimeout(() => {
            // Update the day by 1
            /*
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + 1);

            // Reset stamina to 100
            setStamina(100);
            setDate(newDate);

            console.log("Stamina reset to 100, and date updated to:", newDate);
*/
            // Show DarkRoomDetails after fade
            setTimeout(() => {
                setShowDarkRoom(true);
            }, 500);
        }, 500);
    };

    const handleExitDarkRoom = () => {
        setShowDarkRoom(false);
        setIsBlackout(false);
    };

    return (
        <div className={`screen-overlay ${isFading || isBlackout ? "fade-out" : ""}`}>
            {showDarkRoom ? (
                <DarkRoomDetails   onExit={handleExitDarkRoom} />
            ) : (
                <>
                    <h3>Action Type 3</h3>
                    <p>{action.description}</p>
                    <button onClick={handleAction}>Perform Action</button>
                </>
            )}
        </div>
    );
};

export default ActionType3Component;
