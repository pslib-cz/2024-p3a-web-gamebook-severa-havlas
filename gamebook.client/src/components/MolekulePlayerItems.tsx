import React from "react";
import { useGameContext } from "../GameProvider";

export const PlayerItems = () => {
  const { player, setPlayerItems } = useGameContext();

  const addItem = () => {
    setPlayerItems({
      ...player.items,
      newItem: "1", // Example: Add new item with quantity 1
    });
  };

  return (
    <div>
      <h1>Player Items</h1>
      <ul>
        {Object.entries(player.items).map(([itemName, quantity]) => (
          <li key={itemName}>
            {itemName}: {quantity}
          </li>
        ))}
      </ul>
      <button onClick={addItem}>Add Item</button>
    </div>
  );
};


