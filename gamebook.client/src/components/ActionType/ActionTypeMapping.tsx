import { DialogueAction } from "../Dialog/AtomDIalogue";
import { GameBookAction } from "../../types/types"; // Adjust the import path as necessary

export enum ActionTypeEnum {
  
  Dialogue = 2,
 
}

// Correctly define the mapping with specific props
export const actionComponentMap: Record<ActionTypeEnum, React.FC<{ action: GameBookAction }>> = {
  [ActionTypeEnum.Dialogue]: DialogueAction,
};
  