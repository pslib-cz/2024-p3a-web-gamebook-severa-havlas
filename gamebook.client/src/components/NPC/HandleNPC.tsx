import React, { useState, useEffect } from "react";

interface NPC {
  npcId: number;
  name: string;
  description: string;
}

interface Dialog {
  dialogId: number;
  text: string;
}

interface DialogOption {
  dialogId: number;
  text: string;
}

interface NpcInteractionProps {
  npcId: number;
}

const NpcInteraction: React.FC<NpcInteractionProps> = ({ npcId }) => {
  const [npc, setNpc] = useState<NPC | null>(null);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [options, setOptions] = useState<DialogOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch NPC details on mount
    const fetchNpcDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://localhost:7058/api/NPCs/${npcId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch NPC with ID ${npcId}`);
        }
        const data: NPC = await response.json();
        setNpc(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNpcDetails();
  }, [npcId]);

  const handleStartConversation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://localhost:7058/api/Dialogs/${npcId}`, { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to start dialog.");
      }
      const dialogData: Dialog = await response.json();
      setDialog(dialogData);
      fetchDialogOptions(dialogData.dialogId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDialogOptions = async (dialogId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://localhost:7058/api/Dialogs/getOptions/${dialogId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dialog options.");
      }
      const optionsData: DialogOption[] = await response.json();
      setOptions(optionsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = (dialogId: number) => {
    fetchDialogOptions(dialogId);
    setDialog(null); // Clear current dialog when moving to next options
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {npc && (
        <div>
          <h2>{npc.name}</h2>
          <p>{npc.description}</p>
          {!dialog && options.length === 0 && (
            <button onClick={handleStartConversation}>Start Conversation</button>
          )}
        </div>
      )}

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
              onClick={() => handleOptionClick(option.dialogId)}
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
