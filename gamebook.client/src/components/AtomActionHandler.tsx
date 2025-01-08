import React from "react";
import { ActionTypeEnum } from "./AtomActionTypeMapping";
import { actionComponentMap } from "./AtomActionTypeMapping";

interface GameBookAction {
  ActionId: number;
  ActionTypeId: number;
  Options: any[];
  ReqItem?: number;
  ReqProgress?: number;
  ReqNPC?: number;
  Description: string;
  ReqAction?: number;
}

interface ActionHandlerProps {
  action: GameBookAction;
}

export const ActionHandler: React.FC<ActionHandlerProps> = ({ action }) => {
  const ActionComponent = actionComponentMap[action.ActionTypeId as ActionTypeEnum];

  if (!ActionComponent) {
    return <div>Unknown action type: {action.ActionTypeId}</div>;
  }

  return (
    <div>
      <ActionComponent action={action} />
    </div>
  );
};
