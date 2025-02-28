import React, { useState } from 'react';
import { useGameContext } from '../../GameProvider';


const Work: React.FC = () => {
    const { stamina, setStamina, money, setMoney } = useGameContext();
    const handleWork = () => {
        setStamina(0);
        setMoney(money + 200);
    };

    return (
        <div>
            <p>You worked for 8 hours, you are exhausted.</p>
            <button onClick={handleWork}>Finish Work</button>
        </div>
    );
};

export default Work;