import React, { useState } from "react";
import ActionType3Component from "../ActionType/ActionType3Component";
interface Dialog {
  dialogId: number;
  text: string;
}

interface Action {
  actionId: number;
  description: string;
  actionTypeId: number; // Added actionTypeId
}

interface NPC {
  npcId: number;
  name: string;
  dialogs: Dialog[];
  action: Action;
}

interface NpcInteractionProps {
  npc: NPC;
}

// Components for different action types


const NpcInteraction: React.FC<NpcInteractionProps> = ({ npc }) => {
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [options, setOptions] = useState<Dialog[]>(npc.dialogs);

  const handleStartConversation = () => {
    if (options.length > 0) {
      setDialog(options[0]); // Start the first dialog
      setOptions(options.slice(1)); // Remove the first dialog from options
    }
  };

  const handleOptionClick = (nextDialog: Dialog) => {
    setDialog(nextDialog);
    setOptions((prevOptions) => prevOptions.filter((opt) => opt.dialogId !== nextDialog.dialogId));
  };

  // Render action based on actionTypeId
  const renderActionComponent = (action: Action) => {
    switch (action.actionTypeId) {
      case 3:
        return <ActionType3Component action={action} />;
      // Add more cases for other actionTypeIds here
      default:
        return <p>Unknown action type: {action.actionTypeId}</p>;
    }
  };

  return (
    <div>
      <h2>{npc.name}</h2>
      {npc.action && renderActionComponent(npc.action)}

      {dialog === null && options.length === 0 ? (
        <button onClick={handleStartConversation}>Start Conversation</button>
      ) : null}

      {dialog && (
        <div>
          <h3>Dialog</h3>
          <p>{dialog.text}</p>
        </div>
      )}

      {options.length > 0 && (
        <div>
          <h4>Options</h4>
          {options.map((option) => (
            <button
              key={option.dialogId}
              onClick={() => handleOptionClick(option)}
              style={{
                marginRight: "10px",
                padding: "5px 10px",
              }}
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
