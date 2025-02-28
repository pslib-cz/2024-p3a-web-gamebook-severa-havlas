import React, { useState } from 'react';
import { useGameContext } from '../../GameProvider';


const Pray: React.FC = () => {
    const { stamina, setStamina,  } = useGameContext();
    const handlePray = () => {
        setStamina(0);
        
    };

    return (
        <div>
            <p>You prayed for so long</p>
            <button onClick={handlePray}>Pray</button>
        </div>
    );
};

export default Pray;