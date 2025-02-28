import React from 'react';
import { useGameContext } from '../../GameProvider';

const Heal: React.FC = () => {
    const { setStamina, stamina } = useGameContext();

    const handleHeal = () => {
       setStamina(stamina + 50);
    };

    return (
        <button onClick={handleHeal}>
            Heal
        </button>
    );
};

export default Heal;