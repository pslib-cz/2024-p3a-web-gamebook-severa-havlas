import React, { useState } from "react";
import { useGameContext } from "../../GameProvider";
import "./ActionType3Component.css"; // Import CSS for animations

interface Action {
    actionId: number;
    description: string;
    actionTypeId: number;
}

const ActionType3Component: React.FC<{ action: Action }> = ({ action }) => {
    const { stamina, date, setStamina, setDate } = useGameContext();
    const [isFading, setIsFading] = useState(false);

    const handleAction = () => {
        setIsFading(true);
        
        setTimeout(() => {
            // Update the day by 1
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + 1);

            // Reset stamina to 100
            setStamina(100);
            setDate(newDate);

            console.log("Stamina reset to 100, and date updated to:", newDate);

            // Fade back in after transition
            setTimeout(() => setIsFading(false), 500);
        }, 500);
    };

    return (
        <div className={`screen-overlay ${isFading ? "fade-out" : ""}`}>
            <h3>Action Type 3</h3>
            <p>{action.description}</p>
            <button onClick={handleAction}>Perform Action</button>
        </div>
    );
};

export default ActionType3Component;
