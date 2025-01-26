import ConnectionsList from "./GetConnectionList";
import PostConnection from "./PostConnection";
import {RoomConnections} from "./BetterConnections";
const Connection = () => {
    return (
        <>
            <PostConnection />
            <ConnectionsList />
            <RoomConnections />
        </>
    );
}

export default Connection;