import React, { useState } from "react";
import ReactHowler from "react-howler";

const BackgroundSound: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false); // Start as false

    return (
        <div>
            <ReactHowler 
                src="gamebook.client\public\howling-wind-109590.mp3"  // Ensure this file exists
                playing={isPlaying} 
                loop={true} 
                volume={0.3}  
            />
           
        </div>
    );
};

export default BackgroundSound;
