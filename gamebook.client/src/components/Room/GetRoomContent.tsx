import React, { useState } from "react";
import { useGameContext } from "../../GameProvider";
import NpcInteraction from "../NPC/HandleNPC";

type RoomContentViewerProps = {
  roomContent: {
    npCs: {
      npcId: number;
      name: string;
      dialogs: { dialogId: number; text: string }[];
      action: { actionId: number; description: string, actionTypeId: number  };
    }[];
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
  const [selectedNpc, setSelectedNpc] = useState<RoomContentViewerProps["roomContent"]["npCs"][0] | null>(null);

  const { setPlayerItems } = useGameContext();

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

        {/* NPCs */}
        <div>
          <strong>NPCs:</strong>
          {roomContent.npCs?.length > 0 ? (
            <ul>
              {roomContent.npCs.map((npc) => (
                <li key={npc.npcId}>
                  {npc.npcId} - {npc.name}{" "}
                  <button
                    onClick={() => setSelectedNpc(npc)}
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

        {/* Items */}
        <div>
          <strong>Items:</strong>
          {roomContent.items?.length > 0 ? (
            <ul>
              {roomContent.items.map((item) => (
                <li key={item.itemPositionId}>
                  {item.item ? (
                    <>
                      {item.item.itemId} - {item.item.name}{" "}
                      <button
                        onClick={() =>
                          item.item &&
                          handlePickUpItem(item.item.itemId, item.item.name)
                        }
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

        {/* NPC Interaction */}
        {selectedNpc && (
          <div style={{ marginTop: "20px" }}>
            <h3>Interact with {selectedNpc.name}</h3>
            <NpcInteraction npc={selectedNpc} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomContentViewer;
