import RoomRequirementsForm from "../Requireds/PatchRequireds";
import RoomList from "./GetRooms";
import UpdateRoomContentForm from "./PatchRoomContent";
import CreateRoom from "./PostRoomForm";

const Room = () => {
    return (
        <>
            <CreateRoom />
            <RoomRequirementsForm />
            <UpdateRoomContentForm />
            <RoomList />
        </>
    );
}

export default Room;