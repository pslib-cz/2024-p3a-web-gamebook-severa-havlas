

// Define the types for connected entities
export type Connection ={
  connectionId: number;
  fromRoomId: number;
  toRoomId: number;
}

export type Item = {
  itemId: number;
  name: string;
}

export type NPC = {
  npcId: number;
  name: string;
}

export type GameBookAction = {
  actionId: number;
  description: string;
}

export type Room = {
  roomId: number;
  imgUrl: string; 
  name: string; // Name of the room
  text: string; // Description of the room
  
  // Relationships
  items: Item[]; // Collection of items in the room
  npcs: NPC[]; // Collection of NPCs in the room
  itemPositions: ItemPosition[]; // Item positions (if applicable)

  // Connections
  connectionsFrom: Connection[]; // Connections originating from this room
  connectionsTo: Connection[]; // Connections leading to this room


}


export type requireds = {
  requiredItems: Item[]; // Items required for this room
  requiredNPCs: NPC[]; // NPCs required for this room
  requiredActions: GameBookAction[]; // Actions required for this room
}
// Define types for ItemPosition (if applicable)
export type ItemPosition ={
  positionId: number;
  x: number; // X coordinate
  y: number; // Y coordinate
}
