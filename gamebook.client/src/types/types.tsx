// Define the type for Image as a base64 string (you can change the type depending on how the byte array is handled)
type RoomImage = string;  // Base64 encoded image string

// Define the types for connected entities
interface Connection {
  connectionId: number;
  fromRoomId: number;
  toRoomId: number;
}

interface Item {
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
  img: RoomImage; // Image in base64 string
  name: string; // Name of the room
  text: string; // Description of the room
  
  // Relationships
  items: Item[]; // Collection of items in the room
  npcs: NPC[]; // Collection of NPCs in the room
  itemPositions: ItemPosition[]; // Item positions (if applicable)

  // Connections
  connectionsFrom: Connection[]; // Connections originating from this room
  connectionsTo: Connection[]; // Connections leading to this room

  // Required Items, NPCs, and Actions
  requiredItems: Item[]; // Items required for this room
  requiredNPCs: NPC[]; // NPCs required for this room
  requiredActions: GameBookAction[]; // Actions required for this room
}

// Define types for ItemPosition (if applicable)
interface ItemPosition {
  positionId: number;
  x: number; // X coordinate
  y: number; // Y coordinate
}
