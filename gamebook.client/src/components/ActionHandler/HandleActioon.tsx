import { useGameContext } from "../../GameProvider";


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

const handleAction = (action: Action, source: string) => {
    const { setPreparedAction } = useGameContext();

    console.log(`Preparing action: ${action.description}`);
    setPreparedAction({ action, source });
};

export default handleAction;
