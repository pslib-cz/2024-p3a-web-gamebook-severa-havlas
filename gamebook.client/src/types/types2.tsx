export type ActionType = {
    actionTypeId: number;
    name: string;
    gameBookActions?: GameBookAction[]; // Optional because it might not always be loaded
  }
  
  export type Connection = {
    connectionId: number;
    fromRoomId: number;
    room?: Room; // Optional because it might not always be loaded
    toRoomId: number;
    toRoom?: Room; // Optional because it might not always be loaded
    x?: number | null; // Nullable in the DB
    y?: number | null; // Nullable in the DB
    imgUrl?: string | null; 
    state?: boolean;
  }
  
  export type Dialog = {
    dialogId: number;
    npcId?: number | null; // Nullable in the DB
    npc?: NPC; // Optional because it might not always be loaded
    actionId?: number | null; // Nullable in the DB
    gameBookAction?: GameBookAction; // Optional because it might not always be loaded
    parentDialogId?: number | null; // Nullable for recursive relationship
    parentDialog?: Dialog; // Optional for recursive relationship
    childDialogs?: Dialog[]; // Optional because it might not always be loaded
    text: string;
    label: string;
  }
  
  export type GameBookAction =  {
    actionId: number;
    actionTypeId: number;
    actionType?: ActionType; // Optional because it might not always be loaded
    reqItem?: number | null; // Nullable in the DB
    reqProgress?: number | null; // Nullable in the DB
    reqNPC?: number | null; // Nullable in the DB
    description: string;
    reqAction?: number | null; // Nullable in the DB
    miniGameData: string;
    requiredRoomId?: number | null; // Nullable in the DB
    requiredRoom?: Room; // Optional because it might not always be loaded
    currentRoomId?: number | null; // Nullable in the DB
    currentRoom?: Room; // Optional because it might not always be loaded
    dialogs?: Dialog[]; // Optional because it might not always be loaded
  }
  
  export type Item = {
    itemId: number;
    name: string;
    description: string;
    gameBookActionId?: number | null; // Nullable in the DB
    gameBookAction?: GameBookAction; // Optional because it might not always be loaded
    itemPositionId?: number | null; // Nullable in the DB
    itemPosition?: ItemPosition; // Optional because it might not always be loaded
    imgUrl?: string | null; // Nullable byte array
    requiredRoomId?: number | null; // Nullable in the DB
    requiredRoom?: Room; // Optional because it might not always be loaded
    target?: number | null; // Nullable in the DB
    price?: number | null; // Nullable in the DB
    quantity?: number; // Optional because it might not always be loaded
  }
  
  export type ItemPosition = {
    itemPositionId: number;
    roomId: number;
    room?: Room; // Optional because it might not always be loaded
    itemId: number;
    item?: Item; // Optional because it might not always be loaded
    x: number;
    y: number;
  }
  
  export type NPC = {
    npcId: number;
    name: string;
    description: string;
    dialogs?: Dialog[]; // Optional because it might not always be loaded
    actionId?: number | null; // Nullable in the DB
    action?: GameBookAction; // Optional because it might not always be loaded
    currentRoomId?: number | null; // Nullable in the DB
    currentRoom?: Room; // Optional because it might not always be loaded
    requiredRoomId?: number | null; // Nullable in the DB
    requiredRoom?: Room; // Optional because it might not always be loaded
    img?: Uint8Array | null; // Nullable byte array
    target?: number | null; // Nullable in the DB
  }
  
  export type Progress = {
    progressId: number;
    name: string;
    value: number;
    currentRoomId?: number | null; // Nullable in the DB
    currentRoom?: Room; // Optional because it might not always be loaded
  }
  
  export type Room ={
    roomId: number;
    imgUrl: string;
    name: string;
    text: string;
    requiredItems?: Item[]; // Optional because it might not always be loaded
    requiredNPCs?: NPC[]; // Optional because it might not always be loaded
    requiredActions?: GameBookAction[]; // Optional because it might not always be loaded
    progress?: Progress[]; // Optional because it might not always be loaded
    connectionsFrom?: Connection[]; // Optional because it might not always be loaded
    connectionsTo?: Connection[]; // Optional because it might not always be loaded
    npcs?: NPC[]; // Optional because it might not always be loaded
    items?: ItemPosition[]; // Optional because it might not always be loaded
    triggerActions?: GameBookAction[]; // Optional because it might not always be loaded
  }
  