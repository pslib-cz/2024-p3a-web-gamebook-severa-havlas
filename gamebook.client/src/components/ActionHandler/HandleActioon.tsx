import { useGameContext } from "../../GameProvider";
import { useEffect } from "react";

interface Action {
    actionId: number;
    description: string;
    miniGameData: string;
    actionTypeId: number;
  }

interface ActionHandlerProps {
  action: Action;
  source: string;
}

const handleAction: React.FC<ActionHandlerProps> = ({ action, source }) => {
  const { setPreparedAction } = useGameContext();

 
    console.log(`Preparing action: ${action.description}`);
    setPreparedAction({ action, source });
 

  return <></>; // or return actual JSX
};

export default handleAction;
