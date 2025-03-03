import React, { useState, useEffect } from "react";
import ActionType3Component from "../ActionType/ActionType3Component";
import { ApiBaseUrl } from "../../EnvFile";
import handleAction from "../ActionHandler/HandleActioon";
import { useGameContext } from "../../GameProvider";
import { Dialog, GameBookAction, NPC } from "../../types/types2";

type NpcInteractionProps = {
  npc: NPC;
}

const NpcInteraction: React.FC<NpcInteractionProps> = ({ npc }) => {
  const { setPreparedAction, setIsActionOpen } = useGameContext();
  const { completedDialogs, markDialogAsCompleted } = useGameContext();
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [options, setOptions] = useState<Dialog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let availableDialogs = npc.dialogs || [];

    // Odemknout dialogy, pokud byl jejich parentDialog dokončen
    availableDialogs = availableDialogs.filter(dialog =>
        !dialog.parentDialog || completedDialogs.has(dialog.parentDialog.dialogId)
    );

    if (availableDialogs.length > 0) {
        setOptions(availableDialogs);
        setDialog(null); // Reset dialogu, aby se zobrazil nový
    } else {
        setOptions([]);
    }
}, [npc, completedDialogs]);

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
    markDialogAsCompleted(nextDialog.dialogId);
    await fetchDialogOptions(nextDialog.dialogId);
  };

  

  const renderActionComponent = (action: GameBookAction) => {
   
        return (
          <div>
            <button
              onClick={() => {
                console.log(`Preparing action: ${action.description}`);
                setIsActionOpen(true);  // Open overlay when action is prepared
                setPreparedAction({ action, source: "npc" });
              }}
            >
              {action.description}
            </button>
          </div>
        );
   
    
  };
  

 


  return (
    <div>
       
      <h2>{npc.name}</h2>
        
      {npc.action && renderActionComponent(npc.action)}

      {dialog && (
        <div>
         
          <p>{dialog.text}</p>
        </div>
      )}

      {loading && <p>Loading options...</p>}

      {options.length > 0 && (
        <div>
         
          {options.map((option) => (
            <button
              key={option.dialogId}
              onClick={() => handleOptionClick(option)}
              style={{ marginRight: "10px", padding: "5px 10px" }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NpcInteraction;
