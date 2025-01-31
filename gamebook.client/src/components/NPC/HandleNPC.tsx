import React, { useState, useEffect } from "react";
import ActionType3Component from "../ActionType/ActionType3Component";
import { ApiBaseUrl } from "../../EnvFile";
import handleAction from "../ActionHandler/HandleActioon";
interface Dialog {
  dialogId: number;
  text: string;
}

interface Action {
  actionId: number;
  description: string;
  miniGameData: string;
  actionTypeId: number;
}

interface NPC {
  npcId: number;
  name: string;
  dialogs: Dialog[] | null;
  action: Action;
}

interface NpcInteractionProps {
  npc: NPC;
}

const NpcInteraction: React.FC<NpcInteractionProps> = ({ npc }) => {
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [options, setOptions] = useState<Dialog[]>(npc.dialogs || []);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDialogOptions = async (dialogId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${ApiBaseUrl}/api/Dialogs/getOptions/${dialogId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dialog options");
      }
      const newOptions: Dialog[] = await response.json();
      setOptions(newOptions);
    } catch (error) {
      console.error("Error fetching dialog options:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = async (nextDialog: Dialog) => {
    setDialog(nextDialog);
    setOptions([]);
    await fetchDialogOptions(nextDialog.dialogId);
  };

  const renderActionComponent = (action: Action) => {
    
    switch (action.actionTypeId) {
      case 3:
          handleAction(action, "asd");
        return <ActionType3Component action={action} />;
      default:
        return <p>Unknown action type: {action.actionTypeId}</p>;
    }
  };

 


  return (
    <div>
       
      <h2>{npc.name}</h2>
        
      {npc.action && renderActionComponent(npc.action)}

      {dialog && (
        <div>
          <h3>Dialog</h3>
          <p>{dialog.text}</p>
        </div>
      )}

      {loading && <p>Loading options...</p>}

      {options.length > 0 && (
        <div>
          <h4>Options</h4>
          {options.map((option) => (
            <button
              key={option.dialogId}
              onClick={() => handleOptionClick(option)}
              style={{ marginRight: "10px", padding: "5px 10px" }}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NpcInteraction;
