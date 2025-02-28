import React, { useState } from 'react';
import { useGameContext } from '../../GameProvider';

const Sacrificer: React.FC = () => {
    const { player, sacrificeItem } = useGameContext();
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const handleSacrifice = () => {
        if (selectedItem) {
            const item = player.items.find((i) => i.name === selectedItem);
            if (item) {
                sacrificeItem(item.name);
               alert("You have sacrificed " + item.name);
            }
            setSelectedItem(null);
        }
    };

    return (
        <div>
            <h2>Sacrifice an Item</h2>
            <select
                value={selectedItem || ''}
                onChange={(e) => setSelectedItem(e.target.value)}
            >
                <option value="" disabled>Select an item</option>
                {player.items.map((item) => (
                    <option key={item.name} value={item.name}>
                        {item.name}
                    </option>
                ))}
            </select>
            <button onClick={handleSacrifice} disabled={!selectedItem}>
                Sacrifice
            </button>
        </div>
    );
};

export default Sacrificer;