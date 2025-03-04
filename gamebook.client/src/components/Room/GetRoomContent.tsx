import React, { useState, useEffect, useCallback } from "react";
import { useGameContext } from "../../GameProvider";
import NpcInteraction from "../NPC/HandleNPC";
import { ApiBaseUrl } from "../../EnvFile";
import styles from "./GetRoomContent.module.css"
import { Item, Room } from "../../types/types2";
import { NPC } from "../../types/types2";
export type RoomContentViewerProps = {
  roomContent: {
    npCs: {
      npcId: number;
      name: string;
      description: string;
      dialogs: { dialogId: number; text: string; label: string }[];
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



const RoomContentViewer: React.FC<RoomContentViewerProps> = ({ roomContent }) => {
  const { setPlayerItems, setPreparedAction, setIsActionOpen } = useGameContext();
  const [hasTriggeredAction, setHasTriggeredAction] = useState(false);
  
  const triggerAction = useCallback(
    (
      action: RoomContentViewerProps["roomContent"]["triggerActions"][0],
      source: string
    ) => {
      console.log("Triggering action", action);
      setIsActionOpen(true);
      setPreparedAction({ action, source });
    },
    [setPreparedAction]
  );

  useEffect(() => {
    if (
      !hasTriggeredAction &&
      roomContent.triggerActions &&
      roomContent.triggerActions.length > 0
    ) {
      triggerAction(roomContent.triggerActions[0], "roomContent");
      setHasTriggeredAction(true);
    }
  }, [roomContent.triggerActions, hasTriggeredAction, triggerAction]);

  const handlePickUpItem = (itemId: number, itemName: string) => {
    setPlayerItems((prevItems: Item[]) => {
      const itemIndex = prevItems.findIndex((item) => item.itemId === itemId);
      if (itemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: (updatedItems[itemIndex].quantity ?? 0) + 1,
        };
        return updatedItems;
      } else {
        return [
          ...prevItems,
          {
            itemId,
            name: itemName,
            description: "", // Add a default description or fetch it if available
            quantity: 1,
          },
        ];
      }
    });
    console.log(`Picked up: ${itemName}`);
  };

  // Define `a` correctly
  let a: NPC | null =
    roomContent.npCs && roomContent.npCs.length > 0
      ? {
          npcId: roomContent.npCs[0].npcId,
          name: roomContent.npCs[0].name,
          description: roomContent.npCs[0].description,
          dialogs: roomContent.npCs[0].dialogs,
          action: roomContent.npCs[0].action ?? undefined,
        }
      : null;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginTop: "20px" }}>
        <div className={styles.dialogs}>
          {roomContent.npCs && roomContent.npCs.length > 0 ? (
            <ul>
              {roomContent.npCs.map((npc) => (
                <li className={styles.dialog} key={npc.npcId}>
                  <img
                    className={styles.imageNPC}
                    src={`${ApiBaseUrl}/api/NPCs/${npc.npcId}/image`}
                    alt={npc.name}
                  />
                  <div className={styles.text}>
                    {a && <NpcInteraction npc={a} />}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p></p>
          )}
        </div>
        <div>
          {roomContent.items && roomContent.items.length > 0 ? (
            <>
              <strong>Items:</strong>
              <ul>
                {roomContent.items.map((item) => (
                  <li key={item.itemPositionId}>
                    {item.item ? (
                      <>
                        {item.item.itemId} - {item.item.name}
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
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomContentViewer;

