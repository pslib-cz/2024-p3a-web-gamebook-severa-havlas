import React, { useState, useEffect } from "react";
import {requireds, Item, NPC, GameBookAction} from "../types/types"
import { data } from "react-router-dom";
type GetRequiredsProps = {

    roomId: string;
}

const GetRequireds: React.FC<GetRequiredsProps> = ({ roomId }) => {
    const [roomData, setRoomData] = useState<requireds>({ requiredItems: [], requiredNPCs: [], requiredActions: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch room details from the API
        const fetchRoomData = async () => {
            try {
                const response = await fetch(`https://localhost:7058/api/Rooms/Required/${roomId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const contentType = response.headers.get("Content-Type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Invalid response format: Expected JSON");
                }

                const data = await response.json();
                setRoomData(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomData();
    }, [roomId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.error(error);
        return <div>Error: {error}</div>;
    }
    if (!roomData || (!roomData.requiredItems.length && !roomData.requiredNPCs.length && !roomData.requiredActions.length)) {
        return <div>No data available for this room</div>;
    }
    return (
        <div>
            <h1>Room Details</h1>
            <h2>Required Items</h2>
            {roomData.requiredItems.length > 0 ? (
                <ul>
                    {roomData.requiredItems.map((item, index) => (
                        <li key={index}>{item.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No required items</p>
            )}

            <h2>Required NPCs</h2>
            {roomData.requiredNPCs.length > 0 ? (
                <ul>
                    {roomData.requiredNPCs.map((npc, index) => (
                        <li key={index}>{npc.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No required NPCs</p>
            )}

            <h2>Required Actions</h2>
            {roomData.requiredActions.length > 0 ? (
                <ul>
                    {roomData.requiredActions.map((action, index) => (
                        <li key={index}>{action.actionId}</li>
                    ))}
                </ul>
            ) : (
                <p>No required actions</p>
            )}
            
        </div>
    );
};

export default GetRequireds;