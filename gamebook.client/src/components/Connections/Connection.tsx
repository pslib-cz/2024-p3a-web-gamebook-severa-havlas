import ConnectionsList from "./GetConnectionList";
import PostConnection from "./PostConnection";
import RoomConnectionForm from "./ConnectionPositionLover";
const Connection = () => {
    return (
        <>
            <PostConnection />
            <ConnectionsList />
            <RoomConnectionForm/>
        </>
    );
}

export default Connection;