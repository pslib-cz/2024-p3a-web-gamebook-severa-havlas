import React, { useContext } from 'react';
import { useGameContext } from '../../GameProvider';

// Assuming you have a context that provides PlayerItems and stamina

const PlayerStats: React.FC = () => {
    const { player, stamina } = useGameContext();

    return (
        <div>
            <h2>Player Stats</h2>
            <div>
                <strong>Items:</strong> {player.items.join(', ')}
            </div>
            <div>
                <strong>Stamina:</strong> {stamina}
            </div>
        </div>
    );
};

export default PlayerStats;