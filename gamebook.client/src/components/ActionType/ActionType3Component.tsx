import React from "react";
import { useGameContext } from "../../GameProvider";

interface Action {
    actionId: number;
    description: string;
    actionTypeId: number; // Added actionTypeId
  }

const ActionType3Component: React.FC<{ action: Action }> = ({ action }) => {
  const { stamina, date, setStamina, setDate } = useGameContext();

  const handleAction = () => {
    // Update the day by 1
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);

    // Reset stamina to 100
    setStamina(100);
    setDate(newDate);

    console.log("Stamina reset to 100, and date updated to:", newDate);
  };

  return (
    <div>
      <h3>Action Type 3</h3>
      <p>{action.description}</p>
      <button onClick={handleAction}>Perform Action</button>
    </div>
  );
};

export default ActionType3Component;
