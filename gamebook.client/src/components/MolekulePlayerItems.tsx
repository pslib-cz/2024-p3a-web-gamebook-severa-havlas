import React from "react";
import { useGameContext } from "../GameProvider";

export const PlayerItems = () => {
  const { player, setPlayerItems } = useGameContext();

 

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

    </div>
  );
};


