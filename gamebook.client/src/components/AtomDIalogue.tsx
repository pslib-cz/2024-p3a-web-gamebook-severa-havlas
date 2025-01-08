import React from "react";

interface Option {
  OptionId: number;
  Text: string;
  NextActionId: number;
}

interface GameBookAction {
  ActionId: number;
  ActionTypeId: number;
  Options: Option[];
  ReqItem?: number;
  ReqProgress?: number;
  ReqNPC?: number;
  Description: string;
  ReqAction?: number;
}

interface DialogueActionProps {
  action: GameBookAction;
}

export const DialogueAction: React.FC<DialogueActionProps> = ({ action }) => {
  const {
    Description,
    Options,
    ReqItem,
    ReqProgress,
    ReqNPC,
    ReqAction,
  } = action;

  // Render any requirements (if applicable)
  const renderRequirements = () => {
    const requirements = [];
    if (ReqItem) requirements.push(`Required Item: ${ReqItem}`);
    if (ReqProgress) requirements.push(`Required Progress: ${ReqProgress}`);
    if (ReqNPC) requirements.push(`Required NPC: ${ReqNPC}`);
    if (ReqAction) requirements.push(`Required Previous Action: ${ReqAction}`);
    return requirements.length > 0 ? (
      <div className="requirements">
        <h4>Requirements:</h4>
        <ul>
          {requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>
    ) : null;
  };

  return (
    <div className="dialogue-action">
      <h3>Dialogue</h3>
      <p>{Description}</p>

      {renderRequirements()}

      <div className="options">
        <h4>Choose an Option:</h4>
        <ul>
          {Options.map((option) => (
            <li key={option.OptionId}>
              <button onClick={() => handleOptionClick(option.NextActionId)}>
                {option.Text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Function to handle option clicks
const handleOptionClick = (nextActionId: number) => {
  // Example: Redirect to the next action, or trigger a callback.
  console.log(`Navigating to Action ID: ${nextActionId}`);
};
