import RoomRequirementsForm from "../Requireds/PatchRequireds";
import RoomList from "./RoomList";
import UpdateRoomContentForm from "./PatchRoomContent";
import CreateRoom from "./PostRoomForm";
import PostItemPosition from "../ItemPosition/PostItemPosition";

const Room = () => {
    return (
        <>
            <CreateRoom />
            <RoomRequirementsForm />
            <UpdateRoomContentForm />
            <RoomList />
            <PostItemPosition />
        </>
    );
}

export default Room;