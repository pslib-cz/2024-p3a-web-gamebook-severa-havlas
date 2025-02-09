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

const useHandleAction = () => {
   /* const { setPreparedAction, setIsActionOpen } = useGameContext();

    const triggerAction = (action: Action, source: string) => {
        
        setPreparedAction({ action, source });
        setIsActionOpen(true);  // Open overlay when action is prepared
    };

    return triggerAction;*/
};

export default useHandleAction;
