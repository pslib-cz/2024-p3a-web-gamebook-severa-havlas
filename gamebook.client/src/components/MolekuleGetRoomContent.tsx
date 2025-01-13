import React, { useState, useEffect } from "react";
import { useGameContext } from "../GameProvider";

type NPC = {
  npcId: number;
  name: string;
};

type Item = {
  itemId: number;
  name: string;
};

type ItemPosition = {
  itemId: number;
  x: number;
  y: number;
};

type RoomContent = {
  npcs: NPC[];
  items: Item[];
  itemPositions: ItemPosition[];
};

type PlayerItem = {
  itemId: number;
  itemName: string;
  quantity: number;
};

type RoomContentViewerProps = {
  roomId: string; // Room ID passed from the parent component
};

const RoomContentViewer: React.FC<RoomContentViewerProps> = ({ roomId }) => {
  const [roomContent, setRoomContent] = useState<RoomContent | null>(null); // Room content state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const { player, setPlayerItems } = useGameContext(); // Access game context

  useEffect(() => {
    const fetchRoomContent = async () => {
      if (!roomId) {
        setError("Invalid Room ID provided.");
        return;
      }

      setLoading(true);
      setError(null); // Clear previous errors

      try {
        const response = await fetch(`https://localhost:7058/api/Rooms/${roomId}/RoomContent`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data: RoomContent = await response.json();
        setRoomContent(data);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
        setRoomContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomContent();
  }, [roomId]); // Re-run fetch when roomId changes

  // Function to handle picking up an item
  const handlePickUpItem = (itemId: number) => {
    const pickedItem = roomContent?.items.find((item) => item.itemId === itemId);
  
    if (!pickedItem) {
      console.error(`Item with ID ${itemId} not found.`);
      return;
    }
  
    // Add or increment the item in the player's inventory
    setPlayerItems((prevItems: PlayerItem[]) => {
      const itemIndex = prevItems.findIndex((item) => item.itemId === pickedItem.itemId);
  
      if (itemIndex >= 0) {
        // Increment quantity if the item already exists
        const updatedItems = [...prevItems];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // Add the item if it doesn't exist
        return [
          ...prevItems,
          {
            itemId: pickedItem.itemId,
            itemName: pickedItem.name,
            quantity: 1,
          },
        ];
      }
    });
  
    console.log("Player's inventory after picking up the item:", player.items);
  
    console.log(`Picked up: ${pickedItem.name}`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Room Content Viewer</h2>

      {loading && <p>Loading room content...</p>}

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          Error: {error}
        </p>
      )}

      {roomContent ? (
        <div style={{ marginTop: "20px" }}>
          <h3>Room Content:</h3>
          <div>
            <strong>NPCs:</strong>
            {roomContent.npcs?.length > 0 ? (
              <ul>
                {roomContent.npcs.map((npc) => (
                  <li key={npc.npcId}>
                    {npc.npcId} - {npc.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No NPCs in this room.</p>
            )}
          </div>

          <div>
            <strong>Items:</strong>
            {roomContent.items?.length > 0 ? (
              <ul>
                {roomContent.items.map((item) => (
                  <li key={item.itemId}>
                    {item.itemId} - {item.name}{" "}
                    <button
                      onClick={() => handlePickUpItem(item.itemId)}
                      style={{
                        marginLeft: "10px",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Pick up
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Items in this room.</p>
            )}
          </div>

          <div>
            <strong>Item Positions:</strong>
            {roomContent.itemPositions?.length > 0 ? (
              <ul>
                {roomContent.itemPositions.map((pos, index) => (
                  <li key={index}>
                    Item ID: {pos.itemId}, X: {pos.x}, Y: {pos.y}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Item Positions in this room.</p>
            )}
          </div>
        </div>
      ) : (
        !loading && !error && <p>No room content available. Please try again.</p>
      )}
    </div>
  );
};

export default RoomContentViewer;
