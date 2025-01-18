import ConnectionsList from "./GetConnectionList";
import PostConnection from "./PostConnection";

const Connection = () => {
    return (
        <>
            <PostConnection />
            <ConnectionsList />
        </>
    );
}

export default Connection;