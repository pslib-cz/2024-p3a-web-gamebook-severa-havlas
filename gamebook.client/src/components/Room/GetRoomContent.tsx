import React, { useState } from "react";
import { useGameContext } from "../../GameProvider";
import NpcInteraction from "../NPC/HandleNPC"; // Import the NpcInteraction component

type RoomContentViewerProps = {
  roomContent: {
    npCs: { npcId: number; name: string }[];
    items: {
      itemPositionId: number;
      roomId: number;
      x: number;
      y: number;
      itemId: number;
      item: {
        itemId: number;
        name: string;
        description: string;
      } | null;
    }[];
  };
};

type PlayerItem = {
  itemId: number;
  itemName: string;
  quantity: number;
};

const RoomContentViewer: React.FC<RoomContentViewerProps> = ({ roomContent }) => {
  const [selectedNpcId, setSelectedNpcId] = useState<number | null>(null); // Selected NPC ID

  const { player, setPlayerItems } = useGameContext(); // Access game context

  const handlePickUpItem = (itemId: number, itemName: string) => {
    setPlayerItems((prevItems: PlayerItem[]) => {
      const itemIndex = prevItems.findIndex((item) => item.itemId === itemId);

      if (itemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        return [
          ...prevItems,
          {
            itemId,
            itemName,
            quantity: 1,
          },
        ];
      }
    });

    console.log(`Picked up: ${itemName}`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Room Content Viewer</h2>

      <div style={{ marginTop: "20px" }}>
        <h3>Room Content:</h3>
        <div>
          <strong>NPCs:</strong>
          {roomContent.npCs?.length > 0 ? (
            <ul>
              {roomContent.npCs.map((npC) => (
                <li key={npC.npcId}>
                  <NpcInteraction npcId={npC.npcId} />
                  {npC.npcId} - {npC.name} {" "}
                  <button
                    onClick={() => setSelectedNpcId(npC.npcId)}
                    style={{
                      marginLeft: "10px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Interact
                  </button>
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
                <li key={item.itemPositionId}>
                  {item.item ? (
                    <>
                      {item.item.itemId} - {item.item.name} {" "}
                      <button
                        onClick={() => item.item && handlePickUpItem(item.item.itemId, item.item.name)}
                        style={{
                          marginLeft: "10px",
                          padding: "5px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Pick up
                      </button>
                    </>
                  ) : (
                    "Unknown item"
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No Items in this room.</p>
          )}
        </div>

        {selectedNpcId && (
          <div style={{ marginTop: "20px" }}>
            <h3>Interact with NPC</h3>
            <NpcInteraction npcId={selectedNpcId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomContentViewer;
