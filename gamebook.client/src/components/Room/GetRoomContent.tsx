import React, { useState, useEffect, useCallback } from "react";
import { useGameContext } from "../../GameProvider";
import NpcInteraction from "../NPC/HandleNPC";

type RoomContentViewerProps = {
  roomContent: {
    npCs: {
      npcId: number;
      name: string;
      dialogs: { dialogId: number; text: string }[];
      action: {
        actionId: number;
        description: string;
        actionTypeId: number;
        miniGameData: string;
      } | null;
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
    triggerActions: {
      actionId: number;
      description: string;
      miniGameData: string;
      actionTypeId: number;
    }[];
  };
};

type PlayerItem = {
  itemId: number;
  itemName: string;
  quantity: number;
};

const RoomContentViewer: React.FC<RoomContentViewerProps> = ({ roomContent }) => {
  const { setPlayerItems, setPreparedAction, setIsActionOpen } = useGameContext();
  const [selectedNpc, setSelectedNpc] = useState<
    RoomContentViewerProps["roomContent"]["npCs"][0] | null
  >(null);
  const [hasTriggeredAction, setHasTriggeredAction] = useState(false);

  // Create a memoized function that triggers an action.
  const triggerAction = useCallback(
    (
      action: RoomContentViewerProps["roomContent"]["triggerActions"][0],
      source: string
    ) => {
      console.log("Triggering action", action);
      setIsActionOpen(true);  // Open overlay when action is prepared
      setPreparedAction({ action, source });
    },
    [setPreparedAction]
  );

  // When triggerActions is available and we haven't yet triggered one, fire it.
  useEffect(() => {
    if (
      !hasTriggeredAction &&
      roomContent.triggerActions &&
      roomContent.triggerActions.length > 0
    ) {
      // For example, trigger the first action in the list.
      triggerAction(roomContent.triggerActions[0], "roomContent");
      setHasTriggeredAction(true);
    }
  }, [roomContent.triggerActions, hasTriggeredAction, triggerAction]);

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
          {roomContent.npCs && roomContent.npCs.length > 0 ? (
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
          {roomContent.items && roomContent.items.length > 0 ? (
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
