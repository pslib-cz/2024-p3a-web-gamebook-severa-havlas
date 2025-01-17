import React from "react";
import { useGameContext } from "../../GameProvider";

export const PlayerItems = () => {
  const { player } = useGameContext();

  return (
    <div>
      <h1>Player Items</h1>
      <ul>
        {player.items.map((item) => (
          <li key={item.itemId}>
            {item.itemName}: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};
